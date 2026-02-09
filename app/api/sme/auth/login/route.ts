import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { checkRateLimit, getClientIdentifier, AUTH_RATE_LIMIT } from '@/lib/rate-limit';
import { logAuthEvent, logSecurityEvent } from '@/lib/audit';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientIdentifier(request);
    const rateLimit = await checkRateLimit(`sme-login:${clientId}`, AUTH_RATE_LIMIT);

    if (!rateLimit.success) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip: clientId, endpoint: 'sme-login' });
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)) } }
      );
    }

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    const smeUser = await db.sMEUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (!smeUser) {
      logAuthEvent('LOGIN_FAILED', { email: normalizedEmail, reason: 'user_not_found' });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!smeUser.isActive) {
      logAuthEvent('LOGIN_FAILED', { email: normalizedEmail, reason: 'account_inactive' });
      return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, smeUser.passwordHash);
    if (!valid) {
      logAuthEvent('LOGIN_FAILED', { email: normalizedEmail, reason: 'invalid_password' });
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const session = await getSession();
    session.userId = smeUser.id;
    session.email = smeUser.email;
    session.firstName = smeUser.firstName;
    session.lastName = smeUser.lastName;
    session.role = 'ADMIN'; // SME users get ADMIN role
    session.isLoggedIn = true;
    await session.save();

    logAuthEvent('LOGIN_SUCCESS', { email: normalizedEmail, userId: smeUser.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    console.error('SME login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
