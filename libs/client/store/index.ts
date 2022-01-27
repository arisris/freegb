import { createStoreon, StoreonModule } from "storeon";
import { setAccessToken } from "./actions";
import { AppEvents, AppState } from "./types";
import gs from "good-storage";

const getTokenKey = process.env.NEXT_PUBLIC_TOKEN_COOKIE_NAME;
const app: StoreonModule<AppState, AppEvents> = (store) => {
  store.on("@init", () => ({ access_token: gs.get(getTokenKey, null) }));
  store.on(setAccessToken, (_, value) => {
    gs.set(getTokenKey, value);
    return { access_token: value };
  });
};

export const store = createStoreon([app]);
export default store;
