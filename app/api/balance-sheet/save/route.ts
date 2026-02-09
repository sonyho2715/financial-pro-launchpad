import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { extractReferrals, saveReferrals, notifyAgentOfReferrals } from '@/lib/services/referral.service';

const balanceSheetSchema = z.object({
  formType: z.enum(['personal', 'business']),
  firstName: z.string().min(1),
  lastName: z.string().optional().default(''),

  // All numeric fields are optional with defaults for flexibility
  age: z.number().optional().default(35),
  retireAge: z.number().optional().default(65),
  dependents: z.number().optional().default(0),
  totalIncome: z.number().optional().default(0),
  totalMonthlyExpenses: z.number().optional().default(0),
  totalAssets: z.number().optional().default(0),
  totalLiabilities: z.number().optional().default(0),

  // Referral fields (optional strings)
  referral1Name: z.string().optional().default(''),
  referral1Contact: z.string().optional().default(''),
  referral2Name: z.string().optional().default(''),
  referral2Contact: z.string().optional().default(''),
  referral3Name: z.string().optional().default(''),
  referral3Contact: z.string().optional().default(''),
  referral4Name: z.string().optional().default(''),
  referral4Contact: z.string().optional().default(''),
}).passthrough(); // Allow additional fields

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = balanceSheetSchema.parse(body);
    const isPersonal = validated.formType === 'personal';

    let prospectId: string | undefined;
    let businessProspectId: string | undefined;

    if (isPersonal) {
      // Create or find personal prospect
      const prospect = await db.prospect.create({
        data: {
          agentId: session.userId,
          email: `no-email+${crypto.randomUUID()}@internal.invalid`,
          firstName: validated.firstName,
          lastName: validated.lastName || undefined,
          source: 'BALANCE_SHEET',
          status: 'ANALYSIS_SENT',
        },
      });
      prospectId = prospect.id;

      // Save financial profile
      await db.financialProfile.create({
        data: {
          prospectId: prospect.id,
          formData: body,
        },
      });
    } else {
      // Create business prospect
      const businessProspect = await db.businessProspect.create({
        data: {
          agentId: session.userId,
          email: `no-email+${crypto.randomUUID()}@internal.invalid`,
          contactName: `${validated.firstName} ${validated.lastName || ''}`.trim(),
          businessName: body.businessName || 'Unnamed Business',
          source: 'BALANCE_SHEET',
          status: 'ANALYSIS_SENT',
        },
      });
      businessProspectId = businessProspect.id;

      // Save business financial profile
      await db.businessFinancialProfile.create({
        data: {
          businessProspectId: businessProspect.id,
          formData: body,
        },
      });
    }

    // Extract and save referrals
    const referrals = extractReferrals(body);
    if (referrals.length > 0) {
      await saveReferrals({
        referrals,
        referrerProspectId: prospectId,
        referrerBusinessId: businessProspectId,
        agentId: session.userId,
        source: `BALANCE_SHEET_${validated.formType.toUpperCase()}`,
      });

      // Notify agent (awaited to ensure delivery)
      await notifyAgentOfReferrals({
        agentId: session.userId,
        referrerName: `${validated.firstName} ${validated.lastName || ''}`.trim(),
        referralCount: referrals.length,
        referrals: referrals.map(r => ({ name: r.name, contact: r.contact })),
      });
    }

    return NextResponse.json({
      success: true,
      prospectId,
      businessProspectId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Balance sheet save error:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
