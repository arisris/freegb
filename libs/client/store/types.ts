import { setAccessToken } from "./actions";

export type AppState = {
  access_token: JWTResponse;
};

export type AppEvents = {
  [setAccessToken]: JWTResponse | null
};
