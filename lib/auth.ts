import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export interface SessionData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'AGENT';
  isLoggedIn: boolean;
}

function getSessionOptions() {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET environment variable is required in production');
  }

  return {
    password: secret || 'complex_password_at_least_32_characters_long_for_dev',
    cookieName: 'fpl_session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  };
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, getSessionOptions());
}

export async function requireAuth() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) {
    throw new Error('Unauthorized');
  }

  // Verify user still exists and is active
  const user = session.role === 'ADMIN'
    ? await db.sMEUser.findUnique({ where: { id: session.userId }, select: { isActive: true } })
    : await db.agent.findUnique({ where: { id: session.userId }, select: { isActive: true } });

  if (!user || !user.isActive) {
    session.destroy();
    throw new Error('Account deactivated');
  }

  return session;
}
