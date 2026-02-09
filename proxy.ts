import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';

interface SessionData {
  userId: string;
  isLoggedIn: boolean;
}

const protectedPaths = ['/dashboard'];
const protectedApiPaths = ['/api/balance-sheet', '/api/auth/logout'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path requires auth
  const isProtectedPage = protectedPaths.some(p => pathname.startsWith(p));
  const isProtectedApi = protectedApiPaths.some(p => pathname.startsWith(p));

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  // Read session cookie
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, {
    password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long_for_dev',
    cookieName: 'fpl_session',
  });

  if (!session.isLoggedIn || !session.userId) {
    if (isProtectedApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/balance-sheet/:path*', '/api/auth/logout'],
};
