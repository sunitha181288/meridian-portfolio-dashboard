import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { auth0: string } }
) {
  const action = params.auth0;

  if (action === 'logout') {
    // Clear the session cookie and redirect to logged-out page
    const response = NextResponse.redirect(
      new URL('/logged-out', req.url)
    );
    // Clear all possible Auth0 session cookies
    response.cookies.set('appSession', '', { maxAge: 0, path: '/' });
    response.cookies.set('__session', '', { maxAge: 0, path: '/' });
    return response;
  }

  if (action === 'login') {
    // Redirect to Auth0 login
    const loginUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/authorize?` +
      `client_id=${process.env.AUTH0_CLIENT_ID}` +
      `&redirect_uri=${process.env.AUTH0_BASE_URL}/auth/callback` +
      `&response_type=code` +
      `&scope=openid profile email`;
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL('/', req.url));
}