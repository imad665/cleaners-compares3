// lib/auth.ts
'server only'
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { compare } from "bcryptjs"

import { getServerSession, type NextAuthOptions } from "next-auth"

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { redirect } from "next/navigation"
import { prisma } from "./prisma"
import { sendWelcomMessage } from "./payement/sendMessage"
import { decryptPassword } from "./crypto"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        }
      },
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //console.log(credentials,'*******************');

        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) return null
        //console.log(user,'iiiiiiiiiii');

        if (user.status === 'SUSPENDED') {
          throw new Error('SUSPENDED');
        }
        if (user.password === credentials.password) {
          return user
        }


        const isValid2 = decryptPassword(user.password) === credentials.password;
         
        
        if (isValid2) {
          return user
        }
        else {
          const isValid = await compare(credentials.password, user.password)
          if (isValid) return user
        }
        //if (!isValid && !isValid2/*  && credentials.password !== 'test_password' */) return null

        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      //console.log(user,'llllllllllllllllllllllll');
      if (user) {
        token.id = user.id;
        token.role = user.role;
        /*  token.name = user.name;
         token.email = user.email; */
        /* token.image = user.image; */
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        /*  session.user.name = token.name as string;
         session.user.email = token.email as string; */
        /*  session.user.image = token.image as string; */
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email) {
        await sendWelcomMessage(user.email);
      }
    }
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/signin",     // custom sign in page
    //signOut: "/auth/signout",   // optional
    error: "/auth/error",       // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (for email provider)
    //newUser: "/auth/signup",    // Redirect here after registration (optional)
  },
}




