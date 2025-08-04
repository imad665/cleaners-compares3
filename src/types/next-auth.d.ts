// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
      role: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
    role: "BUYER"|"SELLER"|"ADMIN"
  }
}

export type UserType = {
  name: string
  email: string
  image: string
  role: string
}
