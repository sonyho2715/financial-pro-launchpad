import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimit, getClientIdentifier, AUTH_RATE_LIMIT } from '@/lib/rate-limit';
import { logAuthEvent, logSecurityEvent } from '@/lib/audit';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientIdentifier(request);
    const rateLimit = await checkRateLimit(`sme-forgot-password:${clientId}`, AUTH_RATE_LIMIT);

    if (!rateLimit.success) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip: clientId, endpoint: 'sme-forgot-password' });
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    const smeUser = await db.sMEUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (smeUser) {
      const resetToken = crypto.randomUUID();
      const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.sMEUser.update({
        where: { id: smeUser.id },
        data: { resetToken, resetTokenExpiresAt },
      });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://financial-pro-launchpad.vercel.app';
      const resetUrl = `${baseUrl}/sme/reset-password?token=${resetToken}`;

      await sendPasswordResetEmail({
        email: smeUser.email,
        firstName: smeUser.firstName,
        resetUrl,
      });

      logAuthEvent('PASSWORD_RESET_REQUEST', { email: normalizedEmail, userId: smeUser.id });
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, you will receive a password reset link.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    console.error('SME forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
