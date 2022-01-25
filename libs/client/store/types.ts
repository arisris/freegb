import { inferQueryOutput } from "../trpc";
import {
  removeToken,
  setToken,
  setCurrentUser,
  removeCurrentUser
} from "./actions";

export type AppState = {
  access_token?: string;
  currentUser?: inferQueryOutput<"users.me">;
};

export type AppEvents = {
  [setToken]: string;
  [removeToken]?: undefined;
  [setCurrentUser]?: inferQueryOutput<"users.me"> | undefined;
  [removeCurrentUser]?: { redirectTo?: string } | undefined;
};
