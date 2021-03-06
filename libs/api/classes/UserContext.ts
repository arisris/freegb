import { Users, Permissions, Roles } from "@prisma/client";
import prisma from "../prisma";

export class UserContext {
  #user:
    | (Users & {
        permissions: Permissions[];
        roles: Roles[];
      })
    | null = null;
  constructor(private userSession: SessionUser | null = null) {}
  hasRole(name: string): boolean {
    return (
      !!this.#user && !!this.#user.roles.some((role) => role.slug === name)
    );
  }
  // assignRoleTo(name: string) {}

  // hasPermission(...values: string[]) {}
  // givePermissionTo(...values: string[]) {}

  // can(...values: string[]) {}
  // cant(...values: string[]) {}

  getUser() {
    return this.#user;
  }
  isAdmin() {
    return this.hasRole("admin");
  }
  isModerator() {
    return this.hasRole("moderator");
  }
  isUser() {
    return this.hasRole("user");
  }
  isGuest() {
    return !this.#user;
  }
  // initialize first
  async init() {
    if (!this.#user) {
      if (this.userSession) {
        try {
          this.#user = await prisma.users.findUnique({
            where: { id: this.userSession.id },
            include: {
              permissions: true,
              roles: true
            }
          });
          delete this.#user.password;
        } catch (e) {
          this.#user = null;
        }
      }
    }
  }
}
