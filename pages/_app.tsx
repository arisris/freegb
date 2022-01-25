import { AppRouter } from "@/libs/api/routers";
import { withTRPC } from "@trpc/next";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { httpLink } from "@trpc/client/links/httpLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { StoreContext } from "storeon/react";
import { App as KonstaApp } from "konsta/react";
import { AppProps } from "next/app";
import { transformer, trpc } from "@/libs/client/trpc";
import { getAccessTokenFromCookie, site_url } from "@/libs/api/utils";
import store from "@/libs/client/store";
import "@/styles/tailwind.css";
import { AppEvents, AppState } from "@/libs/client/store/types";
import { useEffect } from "react";
import { setCurrentUser } from "@/libs/client/store/actions";

function App({ Component, pageProps }: AppProps) {
  const me = trpc.useQuery(["users.me"], {
    refetchOnWindowFocus: false,
    context: {
      skipBatchLink: true
    }
  });
  useEffect(() => {
    store.dispatch(setCurrentUser, me.data);
  }, [me.data]);
  return (
    <StoreContext.Provider value={store}>
      <KonstaApp theme="material" safeAreas={true}>
        <Component {...pageProps} />
      </KonstaApp>
    </StoreContext.Provider>
  );
}
const trpcApp = withTRPC<AppRouter>({
  config({ ctx }) {
    let token: string;
    let headers = {};
    // if (ctx?.req?.headers?.cookie) {
    //   const token = getAccessTokenFromCookie(ctx?.req);
    //   if (token) headers["Authorization"] = "Bearer " + token;
    // }
    if (process.browser) {
      token = store.get().access_token;
      if (token) headers["Authorization"] = "JWT " + token;
    }
    return {
      headers: {
        ...headers,
        "x-ssr": "1"
      },
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: false
          }
        }
      },
      links: [
        // dont catch error in server bechause of console thrown
        () => {
          return ({ prev, next, op }) => {
            next(op, (result) => {
              if (result instanceof Error) {
                if (process.browser) return prev(result);
                // send error object to
                return prev({
                  type: "data",
                  data: {
                    error: result.data
                  }
                });
              }
              //console.log(result)
              prev(result);
            });
          };
        },
        splitLink({
          condition(op) {
            return op.context.skipBatchLink === true;
          },
          true: httpLink({ url: site_url("/api/trpc") }),
          false: httpBatchLink({ url: site_url("/api/trpc") })
        })
      ],
      transformer
    };
  },
  ssr: false // togo SSR Implementation
  // responseMeta({ clientErrors }) {
  //   if (clientErrors.length) {
  //     return {
  //       status: clientErrors[0].data?.httpStatus ?? 500
  //     };
  //   }
  //   return {};
  // }
})(App);

export default trpcApp;
