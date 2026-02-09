import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { checkRateLimit, getClientIdentifier, AUTH_RATE_LIMIT } from '@/lib/rate-limit';
import { logAuthEvent, logSecurityEvent } from '@/lib/audit';

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientIdentifier(request);
    const rateLimit = await checkRateLimit(`sme-reset-password:${clientId}`, AUTH_RATE_LIMIT);

    if (!rateLimit.success) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip: clientId, endpoint: 'sme-reset-password' });
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const body = await request.json();
    const { token, newPassword } = resetPasswordSchema.parse(body);

    const smeUser = await db.sMEUser.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!smeUser) {
      logSecurityEvent('INVALID_TOKEN', { ip: clientId, endpoint: 'sme-reset-password' });
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new password reset.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.sMEUser.update({
      where: { id: smeUser.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    logAuthEvent('PASSWORD_RESET_SUCCESS', { userId: smeUser.id, email: smeUser.email });

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset successfully. You can now sign in.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }
    console.error('SME reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
