import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { extractReferrals, saveReferrals, notifyAgentOfReferrals } from '@/lib/services/referral.service';

const publicLeadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional().default(''),
  email: z.string().email(),
  phone: z.string().optional(),
  agentCode: z.string().optional(),
  source: z.string().optional().default('BALANCE_SHEET_PUBLIC'),

  // Optional referral fields
  referral1Name: z.string().optional().default(''),
  referral1Contact: z.string().optional().default(''),
  referral2Name: z.string().optional().default(''),
  referral2Contact: z.string().optional().default(''),
  referral3Name: z.string().optional().default(''),
  referral3Contact: z.string().optional().default(''),
  referral4Name: z.string().optional().default(''),
  referral4Contact: z.string().optional().default(''),
}).passthrough();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = publicLeadSchema.parse(body);

    // Look up agent by referral code
    let agentId: string | undefined;
    if (validated.agentCode) {
      const agent = await db.agent.findUnique({
        where: { referralCode: validated.agentCode },
        select: { id: true },
      });
      agentId = agent?.id;
    }

    // Create prospect from public submission
    const prospect = await db.prospect.create({
      data: {
        agentId,
        email: validated.email.toLowerCase().trim(),
        phone: validated.phone?.trim() || undefined,
        firstName: validated.firstName.trim(),
        lastName: validated.lastName?.trim() || undefined,
        source: validated.source,
        status: 'NEW',
      },
    });

    // Also create a lead for marketing tracking
    await db.lead.create({
      data: {
        email: validated.email.toLowerCase().trim(),
        phone: validated.phone?.trim() || null,
        source: validated.source,
        resultData: { firstName: validated.firstName, lastName: validated.lastName, agentCode: validated.agentCode },
      },
    });

    // Extract and save referrals
    const referrals = extractReferrals(body);
    if (referrals.length > 0 && agentId) {
      await saveReferrals({
        referrals,
        referrerProspectId: prospect.id,
        agentId,
        source: `PUBLIC_${validated.source}`,
      });

      // Notify agent (fire-and-forget)
      notifyAgentOfReferrals({
        agentId,
        referrerName: `${validated.firstName} ${validated.lastName || ''}`.trim(),
        referralCount: referrals.length,
        referrals: referrals.map(r => ({ name: r.name, contact: r.contact })),
      }).catch(console.error);
    }

    // Notify agent of new prospect (if agent found)
    if (agentId) {
      db.notification.create({
        data: {
          agentId,
          type: 'PROSPECT_SUBMITTED',
          title: 'New Prospect',
          message: `${validated.firstName} ${validated.lastName || ''} submitted a balance sheet analysis.`.trim(),
          metadata: { prospectId: prospect.id, email: validated.email },
        },
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, prospectId: prospect.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Public lead error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
