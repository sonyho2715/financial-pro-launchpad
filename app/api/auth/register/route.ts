import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

const registerSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

async function generateUniqueReferralCode(firstName: string, lastName: string): Promise<string> {
  const base = `${firstName}${lastName}`.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8);

  for (let attempt = 0; attempt < 10; attempt++) {
    const rand = crypto.randomBytes(3).toString('hex');
    const code = `${base}-${rand}`;

    const existing = await db.agent.findUnique({ where: { referralCode: code } });
    if (!existing) return code;
  }

  // Fallback: use full UUID suffix for guaranteed uniqueness
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existing = await db.agent.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(validated.password, 12);
    const referralCode = await generateUniqueReferralCode(validated.firstName, validated.lastName);

    const agent = await db.agent.create({
      data: {
        email: validated.email.toLowerCase().trim(),
        passwordHash,
        firstName: validated.firstName.trim(),
        lastName: validated.lastName.trim(),
        referralCode,
      },
    });

    const session = await getSession();
    session.userId = agent.id;
    session.email = agent.email;
    session.firstName = agent.firstName;
    session.lastName = agent.lastName;
    session.role = 'AGENT';
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({ success: true, referralCode: agent.referralCode });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
