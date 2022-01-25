import { isBrowser } from "@/libs/shared/utils";
import { createStoreon, StoreonModule } from "storeon";
import Router from "next/router";
import {
  removeCurrentUser,
  removeToken,
  setCurrentUser,
  setToken
} from "./actions";
import { AppEvents, AppState } from "./types";

const initialAppState: AppState = {
  access_token: null
};
const getTokenKey = process.env.NEXT_PUBLIC_TOKEN_COOKIE_NAME;
const app: StoreonModule<AppState, AppEvents> = (store) => {
  let storage: Storage;
  store.on("@init", (state) => {
    if (isBrowser) {
      storage = window?.localStorage || window?.sessionStorage || null;
      return {
        ...initialAppState,
        access_token: storage && storage.getItem(getTokenKey)
      };
    }
  });
  store.on(setToken, (state, value) => {
    storage && storage.setItem(getTokenKey, value);
    return { ...state, access_token: value };
  });
  store.on(removeToken, (state) => {
    storage && storage.removeItem(getTokenKey);
    return { ...state, access_token: null };
  });
  store.on(setCurrentUser, (state, currentUser) => {
    return { ...state, currentUser };
  });
  store.on(removeCurrentUser, (_, payload = {}) => {
    store.dispatch(setCurrentUser, null);
    store.dispatch(removeToken);
    payload.redirectTo && Router.push(payload.redirectTo);
  });
};

export const store = createStoreon([app]);
export default store;
