import store from "@/libs/client/store";
import { createQueryClient, createTrpcClient, trpc } from "@/libs/client/trpc";
import { AppProps } from "next/app";
import { useEffect, useMemo, useState } from "react";
import { QueryClientProvider } from "react-query";
import { StoreContext } from "storeon/react";
import { App as KonstaApp } from "konsta/react";
import "@/styles/tailwind.css";

export default function App(props: AppProps) {
  const refetch = useState(false);
  const queryClient = useMemo(
    () => createQueryClient(),
    [store.get()?.auth?.token]
  );
  const trpcClient = useMemo(
    () => createTrpcClient(),
    [store.get()?.auth?.token]
  );

  useEffect(() => {
    let tid: NodeJS.Timeout;
    trpcClient
      .query("users.me", null, {
        context: {
          skipBatchLink: true
        }
      })
      .then((data) => {
        store.dispatch("auth/setCurrentUser", data);
      })
      .catch((e) => {
        console.error("Some thing went wrong");
      })
      .finally(() => {
        tid = setTimeout(() => {
          refetch[1](!refetch[0]);
        }, 1000 * 60); // refetching at one minute
      });
    return () => tid && clearTimeout(tid);
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
