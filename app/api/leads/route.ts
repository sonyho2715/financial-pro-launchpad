import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';

// Initialize Resend (optional - will work without API key but won't send emails)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Zod validation schema
const leadSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  phone: z.string().optional().nullable(),
  source: z.enum(['income_calculator', 'recruiting_mill_quiz']),
  resultData: z.record(z.string(), z.unknown()).optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input with Zod
    const validated = leadSchema.parse(body);

    // Create lead in database
    const lead = await db.lead.create({
      data: {
        email: validated.email.toLowerCase().trim(),
        phone: validated.phone?.trim() || null,
        source: validated.source,
        resultData: validated.resultData as Prisma.InputJsonValue | undefined,
      },
    });

    // Send email with results (if Resend is configured)
    if (resend && process.env.RESEND_FROM_EMAIL) {
      try {
        const isCalculator = validated.source === 'income_calculator';
        const subject = isCalculator
          ? 'Your Income Calculator Results - Financial Pro Launchpad'
          : 'Your Recruiting Mill Quiz Results - Financial Pro Launchpad';

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: validated.email,
          subject,
          html: generateEmailHtml(validated.source, validated.resultData),
        });
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Failed to send email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      id: lead.id,
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

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

// Helper function to generate email HTML
function generateEmailHtml(source: string, resultData: Record<string, unknown> | null | undefined): string {
  const isCalculator = source === 'income_calculator';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isCalculator ? 'Your Income Calculator Results' : 'Your Quiz Results'}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; width: 50px; height: 50px; background: linear-gradient(135deg, #2563eb, #4f46e5); border-radius: 12px; margin-bottom: 10px;"></div>
          <h1 style="color: #111827; margin: 0;">Financial Pro Launchpad</h1>
        </div>

        <div style="background: #f9fafb; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #111827; margin-top: 0;">
            ${isCalculator ? 'Your Income Calculator Results' : 'Your Recruiting Mill Quiz Results'}
          </h2>
          <p style="color: #6b7280; margin-bottom: 0;">
            Thank you for using our free tools! Here's a summary of your results.
          </p>
        </div>

        ${resultData ? `
          <div style="background: #111827; color: white; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <p style="color: #9ca3af; margin-top: 0;">Results Summary</p>
            <pre style="color: #e5e7eb; font-size: 14px; overflow-x: auto;">${JSON.stringify(resultData, null, 2)}</pre>
          </div>
        ` : ''}

        <div style="background: #eff6ff; border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h3 style="color: #1e40af; margin-top: 0;">What's Next?</h3>
          <ul style="color: #1e3a8a; padding-left: 20px;">
            <li>Download the first 3 chapters of "The Hawaii Financial Professional's Blueprint" FREE</li>
            <li>Get exclusive templates and scripts</li>
            <li>Learn the client-focused approach to building your practice</li>
          </ul>
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="https://financial-pro-launchpad.vercel.app" style="display: inline-block; background: #111827; color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 500;">
            Visit Financial Pro Launchpad
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

        <p style="color: #9ca3af; font-size: 14px; text-align: center;">
          By Sony Ho | Helping Hawaii financial professionals build real practices
        </p>
      </body>
    </html>
  `;
}
