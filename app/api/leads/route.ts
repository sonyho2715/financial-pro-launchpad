import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, source, resultData } = body;

    // Basic validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!source || !['income_calculator', 'recruiting_mill_quiz'].includes(source)) {
      return NextResponse.json(
        { success: false, error: 'Valid source is required' },
        { status: 400 }
      );
    }

    // Create lead in database
    const lead = await db.lead.create({
      data: {
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        source,
        resultData: resultData || null,
      },
    });

    // TODO: Send email with results (integrate with email service)
    // await sendEmail({ to: email, template: source, data: resultData });

    return NextResponse.json({
      success: true,
      id: lead.id,
    });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save lead' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Simple endpoint to check API is working
  return NextResponse.json({ status: 'ok', service: 'Financial Pro Launchpad' });
}
