import NextAuth, { AuthOptions, getServerSession, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
    interface Session {
        access_token?: string;
        id_token?: string;
        refresh_token?: string;
        user?: {
            name?: string | null
            email?: string | null
            image?: string | null
        }
    }
}

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile"
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return (user.email ?? "").endsWith("@colegiosatelite.com.br");
        },
        async jwt({ token, account, profile }) {
            if (account) {
                token.accessToken = account.access_token;
                token.id_token = account.id_token;
                token.refresh_token = account.refresh_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.access_token = token.access_token as string | undefined;
            session.id_token = token.id_token as string | undefined;
            session.refresh_token = token.refresh_token as string | undefined;
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/auth/error"
    }
}

export const getAuth = () => getServerSession(authOptions);