import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

// Simple in-memory rate limiting (consider Redis for production multi-instance deployments)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(email);

  if (!limit || now > limit.resetTime) {
    // Allow request and set new limit (max 3 requests per 15 minutes)
    rateLimitMap.set(email, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return true;
  }

  if (limit.count >= 3) {
    return false; // Rate limit exceeded
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Rate limiting check
    if (!checkRateLimit(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'Too many password reset requests. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    // Check if NEXTAUTH_URL is configured
    if (!process.env.NEXTAUTH_URL) {
      console.error('NEXTAUTH_URL environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration attacks
    // Even if user doesn't exist, we return success
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Delete any existing unused tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        used: false,
      },
    });

    // Generate a secure random token
    const token = randomBytes(32).toString('hex');

    // Create reset token that expires in 1 hour
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    // Send email in production if Resend is configured, otherwise log warning
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not configured. Password reset emails will not be sent. Reset URL:', resetUrl);
        // Still return success - the token is created, just email not sent
      } else {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);

          await resend.emails.send({
          from: process.env.EMAIL_FROM || 'ApplySimple <onboarding@resend.dev>',
          to: email,
          subject: 'Reset Your Password - ApplySimple',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">ApplySimple</h1>
                </div>
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                  <h2 style="color: #1f2937; margin-top: 0;">Reset Your Password</h2>
                  <p style="color: #4b5563; font-size: 16px;">
                    We received a request to reset your password for your ApplySimple account. Click the button below to create a new password:
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">Reset Password</a>
                  </div>
                  <p style="color: #6b7280; font-size: 14px;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="color: #3b82f6; font-size: 14px; word-break: break-all;">
                    ${resetUrl}
                  </p>
                  <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                    This link will expire in 1 hour for security reasons.
                  </p>
                  <p style="color: #6b7280; font-size: 14px;">
                    If you didn't request a password reset, you can safely ignore this email.
                  </p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    ApplySimple - Job Application Tracker
                  </p>
                </div>
              </body>
            </html>
          `,
        });

        console.log('Password reset email sent to:', email);
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          // Don't fail the request if email fails - the token is still created
        }
      }
    } else {
      // Development mode - log the reset URL
      console.log('\n\n=================================');
      console.log('PASSWORD RESET LINK:');
      console.log(resetUrl);
      console.log('=================================\n\n');
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
      // Only include resetUrl in development
      ...(process.env.NODE_ENV === 'development' && { resetUrl }),
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      {
        error: 'An error occurred. Please try again.',
        // Include error details in development
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : String(error)
        })
      },
      { status: 500 }
    );
  }
}
