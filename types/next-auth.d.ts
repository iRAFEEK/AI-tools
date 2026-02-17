import 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  /**
   * Extend the default Session type to include our custom fields
   */
  interface Session {
    user: {
      id: string
      role: UserRole
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  /**
   * Extend the default User type
   */
  interface User {
    id: string
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extend the default JWT type
   */
  interface JWT {
    id: string
    role: UserRole
  }
}
