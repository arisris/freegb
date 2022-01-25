import { PrismaClient } from "@prisma/client";
import NodeCache from "node-cache";
import crypto from "crypto";

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}
const cache = new NodeCache({
  stdTTL: 20
});
prisma.$use(async (params, next) => {
  if (params.action.includes("find")) {
    let argKey = crypto
      .createHash("md5")
      .update(JSON.stringify(params.args))
      .digest("hex");
    let key = `${params.model}_${params.action}_${argKey}`;
    let prev = cache.get(key);
    if (!prev) {
      let res = await next(params);
      cache.set(key, res);
      return res;
    }
    return prev;
  }
  return next(params);
});

export default prisma;
