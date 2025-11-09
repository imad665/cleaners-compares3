// lib/auth.ts
'server only'

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { compare } from "bcryptjs"

import { type NextAuthOptions } from "next-auth"

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import { sendWelcomMessage } from "./payement/sendMessage"
import { decryptPassword } from "./crypto"

async function activateUser(userId: string) {
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: 'ACTIVE',
      lastLogin: new Date(),
    }
  })
}

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

        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) return null

        let user = await prisma.user.findUnique({
          where: { email: email },
        })

        let isValid2 = false;
        //console.log(user,'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
        if (!user) {
          const secondaryEmail = await prisma.secondaryEmail.findUnique({
            where: { email: email },
            select: {
              password: true,
              user: true
            },
          })

          if (!secondaryEmail || !secondaryEmail.password) { return null };
          isValid2 = decryptPassword(secondaryEmail.password) === password;
          //console.log(secondaryEmail,isValid2,'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
          
          user = secondaryEmail.user;

        }

        if (!user  ) return null
        //console.log(user,'iiiiiiiiiii');

        if (user.status === 'SUSPENDED') {
          throw new Error('SUSPENDED');
        }

        if (user.password === credentials.password) {
          await activateUser(user.id);
          return user
        }


        isValid2 = isValid2 || decryptPassword(user.password) === credentials.password;


        if (isValid2) {
          await activateUser(user.id);
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




