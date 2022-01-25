import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ValidationError } from "yup";
import { ucWords } from "../shared/utils";

export const errorFormater = ({ shape, error }) => {
  let yupError: {} | any;
  if (error.cause instanceof ValidationError) {
    yupError = {
      type: error.cause.type,
      path: error.cause.path,
      errors: error.cause.errors.map((i) => ucWords(i))
    };
  }
  if (error.cause instanceof PrismaClientKnownRequestError) {
    if (
      error.cause.message.includes("Unique constraint failed on the fields")
    ) {
      let path =
        error.cause.meta?.target && error.cause.meta?.target.length > 0
          ? error.cause.meta?.target[0]
          : undefined;
      yupError = {
        type: "",
        path: path,
        errors: [path ? ucWords(`${path} already exists`) : ""]
      };
    }
    shape.message = "Prisma Error";
  }
  return {
    ...shape,
    data: {
      ...shape.data,
      yupError
    }
  };
};