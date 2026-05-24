import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public paths or login page
        if (pathname.startsWith("/admin/login")) {
          return true;
        }

        // Protect all other /admin routes
        if (pathname.startsWith("/admin")) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    }
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
