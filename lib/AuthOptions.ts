import { AuthOptions, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prismadb";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      circleUserId: string;
      custodyType: "END_USER" | "DEVELOPER";
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (!user || !user.id) {
          throw new Error("User not found!");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV !== "production",
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.id = token.sub as string;
        session.user.circleUserId = token.circleUserId as string;
        session.user.custodyType = token.custodyType as
          | "END_USER"
          | "DEVELOPER";
      }
      return session;
    },
    async jwt({ token }) {
      if (!token) return token;
      if (!token.sub) return token;

      const user = await prisma.user.findFirst({
        where: { id: token.sub },
      });

      if (!user) return token;

      token.name = user.name;
      token.email = user.email;
      token.id = user.id;
      token.circleUserId = user.circleUserId;
      token.custodyType = user.custodyType;

      return token;
    },
  },
};
