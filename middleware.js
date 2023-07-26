import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET }); // Token will exist if user is logged in
  const { pathname } = req.nextUrl;

  // Allow the requests if : Its a request for next-auth session & provider fetching OR the token exists
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next();
  }
  // Redirect them to login page if NO token AND requesting a protected route
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/',
    '/search/:path*',
    '/artist/:path*',
    '/album/:path*',
    '/playlist/:path*',
    '/show/:path*',
    '/episode/:path*',
    '/genre/:path*',
    '/recently/:path*',
    '/collection/:path*',
  ],
};

// export async function middleware(req) {
//   const pathname = req.nextUrl.pathname;
//   const protectedPaths = ["/"];
//   const isPathProtected = protectedPaths?.some((path) => pathname == path);
//   let res = NextResponse.next();
//   if (isPathProtected) {
//     const token = await getToken({ req, secret: process.env.JWT_SECRET });
//     if (!token) {
//       res = NextResponse.redirect(new URL(`/login`, req.url));
//     }
//   }
//   return res;
// }
