import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth({
    pages: { signIn: "/login" }
});

export const config = {
    matcher: ["/dashboard/:path*"]
};