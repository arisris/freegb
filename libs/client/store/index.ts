import { isBrowser } from "@/libs/shared/utils";
import { createStoreon, StoreonModule } from "storeon";
import Router from "next/router";
import { authLogin, authLogout, authSetCurrentUser } from "./actions";
import { AppEvents, AppState } from "./types";
import gs from "good-storage";

const initialAppState: AppState = {
  auth: {
    token: {
      token: null,
      exp: null
    },
    currentUser: null
  }
};
const getTokenKey = process.env.NEXT_PUBLIC_TOKEN_COOKIE_NAME;
const app: StoreonModule<AppState, AppEvents> = (store) => {
  store.on("@init", (state) => {
    return {
      auth: {
        ...state.auth,
        token: gs.get(getTokenKey, null)
      }
    };
  });
  store.on(authLogin, (state, value) => {
    gs.set(getTokenKey, value);
    return { auth: { ...state.auth, token: value } };
  });
  store.on(authLogout, (_, value) => {
    gs.remove(getTokenKey);
    if (value?.redirectTo) {
      let t = setTimeout(() => {
        window.location.replace(value.redirectTo);
        // Router.push(value.redirectTo);
        clearTimeout(t);
      }, 100);
    }
    return { auth: initialAppState.auth };
  });
  store.on(authSetCurrentUser, (state, currentUser) => {
    //if (!currentUser) return { auth: initialAppState.auth };
    return { auth: { ...state.auth, currentUser } };
  });
};

export const store = createStoreon([app]);
export default store;
