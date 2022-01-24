import prisma from "../libs/api/prisma";
import seedUserRolesAndPermissions from "./seeders/permission-roles-user";

Promise.all([seedUserRolesAndPermissions(prisma)]).catch(console.error);
