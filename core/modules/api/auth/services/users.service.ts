import type { Prisma, User } from "@prisma/client"
import bcrypt from "bcryptjs"
import { BaseService } from "@/modules/api/router/services/base.service.js"

/**
 * Manages user-related operations including authentication and account management.
 * Handles secure password storage and verification using bcrypt.
 */
export class UsersService extends BaseService {
  /**
   * Creates a new user with securely hashed password.
   * Automatically handles password hashing before storage.
   */
  async create(user: Prisma.UserCreateInput) {
    return this.prisma().user.create({
      data: { ...user, password: await this.hashPassword(user.password) },
    })
  }

  /**
   * Finds a user by their email address.
   * Used for authentication and checking email uniqueness.
   */
  async findByEmail(email: string) {
    return this.prisma().user.findUnique({
      where: { email },
    })
  }

  /**
   * Verifies a user's password against the stored hash.
   * Uses bcrypt's secure comparison to prevent timing attacks.
   */
  async confirmPassword(user: User, plainPassword: string) {
    return bcrypt.compare(plainPassword, user.password)
  }

  /**
   * Securely hashes a password using bcrypt with appropriate cost factor.
   * Prevents password exposure in case of database breach.
   */
  protected hashPassword(password: string) {
    return bcrypt.hash(password, 10)
  }
}
