import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prismadb";
import { nextAuthSecret } from "@/lib/auth-secret";
import { getOAuthProviderCredentials } from "@/lib/oauth-provider-config";
import { getOrCreateUser } from "@/lib/auth-users";

const googleCredentials = getOAuthProviderCredentials("google");
const githubCredentials = getOAuthProviderCredentials("github");

const providers: NextAuthOptions["providers"] = [];

if (googleCredentials) {
  providers.push(
    GoogleProvider({
      clientId: googleCredentials.clientId,
      clientSecret: googleCredentials.clientSecret,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    })
  );
}

if (githubCredentials) {
  providers.push(
    GitHubProvider({
      clientId: githubCredentials.clientId,
      clientSecret: githubCredentials.clientSecret,
    })
  );
}

export const authOptions: NextAuthOptions = {
  // @auth/prisma-adapter is compatible with next-auth v4
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers,
  secret: nextAuthSecret,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await getOrCreateUser({ email: user.email, name: user.name, image: user.image });
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await getOrCreateUser({ email: user.email, name: user.name, image: user.image });
        token.userId = dbUser.id;
        token.email = dbUser.email;
        token.name = dbUser.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};
