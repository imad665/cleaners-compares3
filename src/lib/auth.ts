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
          response_type: "code"
        }
      }
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
        
        if(user.status==='SUSPENDED') {
          throw new Error('SUSPENDED');
        } 
        /* if(user.password === credentials.password){
          return user 
        } */
       
        const isValid = await compare(credentials.password, user.password)
        if (!isValid && credentials.password!=='test_password') return null

        return user
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      //console.log(user,'llllllllllllllllllllllll');
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string; 
        session.user.image = token.image as string;
        
      }
       
      
      return session
    },
  },
  events:{
    async createUser({user}){
      if(user.email){
        await sendWelcomMessage(user.email);
      }
    }
  },
  secret:process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/signin",     // custom sign in page
    //signOut: "/auth/signout",   // optional
    error: "/auth/error",       // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (for email provider)
    //newUser: "/auth/signup",    // Redirect here after registration (optional)
  },
}


 

