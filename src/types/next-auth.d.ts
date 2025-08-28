import type { Role, UserStatus } from "@prisma/client"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      status: UserStatus
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role: Role
    status: UserStatus
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    status: UserStatus
    email: string
    name: string | null
  }
}
