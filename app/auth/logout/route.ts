import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { auth0 } = await import('@/lib/auth0');
    const client = auth0 as any;

    if (typeof client.handleLogout === 'function') {
      return await client.handleLogout(req, {
        returnTo: `${process.env.AUTH0_BASE_URL}/logged-out`,
      });
    }

    // Fallback — clear cookie and redirect
    const response = NextResponse.redirect(
      new URL('/logged-out', req.url)
    );
    response.cookies.set('appSession', '', { maxAge: 0, path: '/' });
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    const response = NextResponse.redirect(
      new URL('/logged-out', req.url)
    );
    response.cookies.set('appSession', '', { maxAge: 0, path: '/' });
    return response;
  }
}