import {
  NextApiRouteHandler,
  NextapiRouteNotFoundError,
  NextapiRouteOnErrorCallback,
  NextapiRouteTimeoutError
} from "@arisris/next-api-router";
import { ValidationError } from "yup";
import * as jwt from "jwt-simple";
import {
  BadRequest,
  HttpError,
  InternalServerError,
  NotFound,
  RequestTimeout,
  UnprocessableEntity
} from "http-json-errors";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError
} from "@prisma/client/runtime";

export const handleApiError: NextapiRouteOnErrorCallback = (err, req, res) => {
  let error = new InternalServerError(err.message);
  if (typeof err === "string") {
    error.message = err;
  } else if (err instanceof NextapiRouteTimeoutError) {
    error = new RequestTimeout();
  } else if (err instanceof NextapiRouteNotFoundError) {
    error = new NotFound();
  } else if (err instanceof ValidationError) {
    error = new UnprocessableEntity("Validation Error", {
      body: {
        message: err.message,
        path: err.path,
        params: err.params,
        errors: err.errors
      }
    });
  } else if (
    err instanceof PrismaClientValidationError ||
    err instanceof PrismaClientKnownRequestError
  ) {
    error = new UnprocessableEntity("Prisma Validation Error", {
      body: {
        message: err.message,
        path: "",
        params: "",
        errors: []
      }
    });
  } else if (err instanceof HttpError) {
    error = err;
  }
  let space = 0;
  if (process.env.NODE_ENV !== "production") space = 2;
  res.status(error.statusCode);
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify(error, null, space));
  res.end();
};

export const tokenGuard =
  (
    options: {
      required?: boolean;
    } = { required: true }
  ): NextApiRouteHandler =>
  async (req) => {
    try {
      let token =
        req.headers.authorization &&
        req.headers.authorization.includes("Bearer ")
          ? req.headers.authorization.split("Bearer ").join("")
          : null;
      if (!token) throw new BadRequest("Access Token Is Required");
      let payload: { user?: null } = jwt.decode(
        token,
        process.env.APP_SECRET_KEY
      );
      req.locals.user = payload?.user;
    } catch (e) {
      // dont throw if not required
      if (options.required) throw e;
    }
  };
