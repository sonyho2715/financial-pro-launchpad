import crypto from 'crypto';
import { db } from '@/lib/db';
import { sendReferralNotification } from '@/lib/email';

export function extractReferrals(data: Record<string, unknown>): { name: string; contact: string; slot: number }[] {
  const referrals: { name: string; contact: string; slot: number }[] = [];

  for (let i = 1; i <= 4; i++) {
    const name = String(data[`referral${i}Name`] || '').trim();
    const contact = String(data[`referral${i}Contact`] || '').trim();
    if (name && contact) {
      referrals.push({ name, contact, slot: i });
    }
  }

  return referrals;
}

export async function saveReferrals(params: {
  referrals: { name: string; contact: string; slot: number }[];
  referrerProspectId?: string;
  referrerBusinessId?: string;
  agentId?: string;
  source: string;
}): Promise<{ created: number; prospectIds: string[] }> {
  const prospectIds: string[] = [];
  let created = 0;

  for (const ref of params.referrals) {
    // Determine if contact is email or phone
    const isEmail = ref.contact.includes('@');
    const email = isEmail ? ref.contact : `no-email+${crypto.randomUUID()}@internal.invalid`;
    const phone = isEmail ? undefined : ref.contact;

    // Auto-create a Prospect for the referral
    const nameParts = ref.name.trim().split(/\s+/);
    const firstName = (nameParts[0] || ref.name).slice(0, 50).trim();
    const lastName = nameParts.length > 1
      ? nameParts.slice(1).join(' ').slice(0, 50).trim()
      : undefined;

    const prospect = await db.prospect.create({
      data: {
        email,
        phone,
        firstName,
        lastName,
        agentId: params.agentId,
        source: 'REFERRAL',
        status: 'NEW',
      },
    });

    // Create the referral record
    await db.balanceSheetReferral.create({
      data: {
        referrerProspectId: params.referrerProspectId,
        referrerBusinessId: params.referrerBusinessId,
        agentId: params.agentId,
        referredName: ref.name,
        referredContact: ref.contact,
        slotNumber: ref.slot,
        source: params.source,
        autoCreatedProspectId: prospect.id,
      },
    });

    prospectIds.push(prospect.id);
    created++;
  }

  return { created, prospectIds };
}

export async function notifyAgentOfReferrals(params: {
  agentId: string;
  referrerName: string;
  referralCount: number;
  referrals: { name: string; contact: string }[];
}): Promise<void> {
  // Get agent info
  const agent = await db.agent.findUnique({
    where: { id: params.agentId },
    select: { email: true, firstName: true },
  });

  if (!agent) return;

  // Create in-app notification
  await db.notification.create({
    data: {
      agentId: params.agentId,
      type: 'REFERRAL_RECEIVED',
      title: `${params.referralCount} New Referral${params.referralCount > 1 ? 's' : ''}`,
      message: `${params.referrerName} referred ${params.referralCount} ${params.referralCount === 1 ? 'person' : 'people'} to you.`,
      metadata: {
        referrerName: params.referrerName,
        referrals: params.referrals,
      },
    },
  });

  // Send email notification
  await sendReferralNotification({
    agentEmail: agent.email,
    agentName: agent.firstName,
    referrerName: params.referrerName,
    referralCount: params.referralCount,
    referrals: params.referrals,
  });
}
