import { inferMutationOutput, inferQueryOutput } from "../trpc";
import { authLogin, authLogout, authSetCurrentUser } from "./actions";

export type AppState = {
  auth: {
    token: JWTResponse;
    currentUser?: inferQueryOutput<"users.me">;
  };
};

export type AppEvents = {
  [authLogin]: inferMutationOutput<"auth.token" | "auth.create">;
  [authLogout]?: undefined | { redirectTo?: string };
  [authSetCurrentUser]?: inferQueryOutput<"users.me"> | null;
};
