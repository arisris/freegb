import store from "@/libs/client/store";
import { createQueryClient, createTrpcClient, trpc } from "@/libs/client/trpc";
import { AppProps } from "next/app";
import { useEffect, useMemo, useState } from "react";
import { QueryClientProvider } from "react-query";
import { StoreContext } from "storeon/react";
import { App as KonstaApp } from "konsta/react";
import "@/styles/tailwind.css";
import { authSetCurrentUser } from "@/libs/client/store/actions";

export default function App(props: AppProps) {
  const queryClient = useMemo(
    () => createQueryClient(),
    [store.get()?.auth?.token]
  );
  const trpcClient = useMemo(
    () => createTrpcClient(),
    [store.get()?.auth?.token]
  );
  const refetch = useState(false);
  useEffect(() => {
    let tid: NodeJS.Timer;
    const checking = () => {
      tid = setInterval(() => {
        /** let check token are still valid every 10sec in background **/
        if (
          store.get()?.auth?.token?.exp &&
          Date.now() > Number(store.get()?.auth?.token?.exp) * 1000
        ) {
          refetch[1](!refetch[0]);
        }
      }, 1000 * 10);
    };
    trpcClient
      .query("users.me", null, {
        context: {
          skipBatchLink: true
        }
      })
      .then((data) => {
        store.dispatch(authSetCurrentUser, data);
        checking();
      })
      .catch((e) => {
        console.error("Some thing went wrong");
        checking();
      });
    return () => tid && clearInterval(tid);
  }, [store?.get()?.auth?.token, refetch[0]]);

  return (
    <StoreContext.Provider value={store}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <KonstaApp theme="material" safeAreas={true}>
            <props.Component {...props.pageProps} />
          </KonstaApp>
        </QueryClientProvider>
      </trpc.Provider>
    </StoreContext.Provider>
  );
}
