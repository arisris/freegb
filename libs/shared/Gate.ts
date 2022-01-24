// file: https://github.com/williamcruzme/vue-gates/blob/master/src/core/index.js
const pregQuote = (str: string) => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
const match = (str: string, wildcard: string) => {
  const regex = new RegExp(
    `^${wildcard.split(/\*+/).map(pregQuote).join(".*")}$`,
    "g"
  );
  return str.match(regex);
};
type GateOptions = { persistent?: boolean; superRole?: string };
class Gate {
  #canPersistent: boolean = false;

  #roles: string[] = [];

  #permissions: string[] = [];

  #superRole: string | null = null;

  constructor(options: GateOptions) {
    const canPersistent = options.persistent && process.browser;
    const roles = canPersistent
      ? JSON.parse(localStorage.getItem("roles"))
      : [];
    const permissions = canPersistent
      ? JSON.parse(localStorage.getItem("permissions"))
      : [];

    this.#canPersistent = canPersistent;
    this.#roles = roles;
    this.#permissions = permissions;
    this.#superRole = options.superRole;
  }

  /*
  |-------------------------------------------------------------------------
  | Setters
  |-------------------------------------------------------------------------
  |
  | These functions controls the "permissions" and "roles" provided
  | by Vue Gates, or from a custom array.
  |
  */

  setRoles = (roles: string[]): void => {
    this.#roles = roles;
    if (this.#canPersistent) {
      localStorage.setItem("roles", JSON.stringify(roles));
    }
  };

  setPermissions = (permissions: string[]): void => {
    this.#permissions = permissions;
    if (this.#canPersistent) {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }
  };

  /*
  |-------------------------------------------------------------------------
  | Getters
  |-------------------------------------------------------------------------
  |
  | These functions return the "permissions" and "roles" stored.
  | This is useful when you want list all data.
  |
  */

  getRoles = (): string[] => this.#roles;

  getPermissions = (): string[] => this.#permissions;

  isSuperUser = (): boolean =>
    this.#superRole && this.#roles.includes(this.#superRole);

  /*
  |-------------------------------------------------------------------------
  | Directives
  |-------------------------------------------------------------------------
  |
  | These is a group of functions for Vue Directives.
  | This is useful when you want valid a "permission" or "role"
  | programmatically.
  |
  */

  // Roles
  hasRole = (role: string): boolean =>
    this.isSuperUser() || this.#roles.includes(role);

  unlessRole = (role: string): boolean => !this.hasRole(role);

  hasAnyRole = (values: string): boolean => {
    if (this.isSuperUser()) {
      return true;
    }

    const roles = values.split("|");
    return roles.some((role) => this.hasRole(role));
  };

  hasAllRoles = (values: string): boolean => {
    if (this.isSuperUser()) {
      return true;
    }

    const roles = values.split("|");
    return roles.every((role) => this.hasRole(role));
  };

  // Permissions
  hasPermission = (permission: string): boolean =>
    this.isSuperUser() ||
    !!this.#permissions.find((wildcard) => match(permission, wildcard));

  unlessPermission = (permission: string): boolean => !this.hasPermission(permission);

  hasAnyPermission = (values: string): boolean => {
    if (this.isSuperUser()) {
      return true;
    }

    const permissions = values.split("|");
    return permissions.some((permission) => this.hasPermission(permission));
  };

  hasAllPermissions = (values: string): boolean => {
    if (this.isSuperUser()) {
      return true;
    }

    const permissions = values.split("|");
    return permissions.every((permission) => this.hasPermission(permission));
  };
}

export default Gate;
