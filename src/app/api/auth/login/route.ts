import { NextRequest, NextResponse } from 'next/server';
import { createSignedToken, SESSION_COOKIE_NAME, SessionPayload } from '@/lib/serverSession';

export const runtime = 'edge';

// Server-side authoritative credentials (configurable via env vars)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bpscvs.org';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bpscvs@2026';
const ADMIN_NAME = 'Samiti Admin';

const PHOTOGRAPHER_EMAIL = process.env.PHOTOGRAPHER_EMAIL || 'lens.rohan@bpscvs.org';
const PHOTOGRAPHER_PASSWORD = process.env.PHOTOGRAPHER_PASSWORD || 'photo@2026';
const PHOTOGRAPHER_NAME = 'Rohan (Photographer)';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, email, password } = body;

    if (!role || !email || !password) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    let validatedUser: { role: 'admin' | 'photographer'; name: string; email: string } | null = null;

    if (role === 'admin') {
      if (cleanEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        validatedUser = { role: 'admin', name: ADMIN_NAME, email: ADMIN_EMAIL };
      }
    } else if (role === 'photographer') {
      if (cleanEmail === PHOTOGRAPHER_EMAIL.toLowerCase() && password === PHOTOGRAPHER_PASSWORD) {
        validatedUser = { role: 'photographer', name: PHOTOGRAPHER_NAME, email: PHOTOGRAPHER_EMAIL };
      }
    }

    if (!validatedUser) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please verify email and password.' },
        { status: 401 }
      );
    }

    // 7-day session lifetime
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const sessionPayload: SessionPayload = {
      role: validatedUser.role,
      name: validatedUser.name,
      email: validatedUser.email,
      exp,
    };

    const token = await createSignedToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: validatedUser,
    });

    // Set secure HTTP-only cookie
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Server auth login error:', error);
    return NextResponse.json({ error: 'Authentication service error' }, { status: 500 });
  }
}
