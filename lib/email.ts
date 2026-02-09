import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@financial-pro-launchpad.com';

export async function sendReferralNotification(params: {
  agentEmail: string;
  agentName: string;
  referrerName: string;
  referralCount: number;
  referrals: { name: string; contact: string }[];
}): Promise<void> {
  if (!resend) {
    console.warn('Resend not configured, skipping referral notification email');
    return;
  }

  const referralRows = params.referrals
    .map(r => `
      <tr>
        <td style="padding: 10px 16px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 500;">${escapeHtml(r.name)}</td>
        <td style="padding: 10px 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563;">${escapeHtml(r.contact)}</td>
      </tr>
    `)
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Referrals Received</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
        <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #2563eb, #4f46e5); border-radius: 12px; margin-bottom: 8px;"></div>
            <h1 style="color: #111827; margin: 0; font-size: 22px;">New Referrals Received</h1>
          </div>

          <p style="color: #4b5563; margin-bottom: 4px;">Hi ${escapeHtml(params.agentName)},</p>
          <p style="color: #4b5563; margin-bottom: 24px;">
            <strong>${escapeHtml(params.referrerName)}</strong> just submitted their Balance Sheet analysis and referred
            <strong>${params.referralCount} ${params.referralCount === 1 ? 'person' : 'people'}</strong> to you.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #f9fafb; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #111827;">
                <th style="padding: 10px 16px; text-align: left; color: white; font-size: 13px; font-weight: 600;">Name</th>
                <th style="padding: 10px 16px; text-align: left; color: white; font-size: 13px; font-weight: 600;">Contact</th>
              </tr>
            </thead>
            <tbody>
              ${referralRows}
            </tbody>
          </table>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://financial-pro-launchpad.vercel.app'}/dashboard"
              style="display: inline-block; background: #111827; color: white; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-weight: 500;">
              View in Dashboard
            </a>
          </div>

          <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-bottom: 0;">
            These referrals have been auto-added to your prospect pipeline.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: params.agentEmail,
      subject: `${params.referralCount} new referral${params.referralCount > 1 ? 's' : ''} from ${params.referrerName}`,
      html,
      replyTo: 'mrsonyho@gmail.com',
    });
  } catch (error) {
    console.error('Failed to send referral notification:', error);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
