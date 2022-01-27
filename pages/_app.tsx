import store from "@/libs/client/store";
import { createQueryClient, createTrpcClient, trpc } from "@/libs/client/trpc";
import { AppProps } from "next/app";
import { useMemo } from "react";
import { QueryClientProvider } from "react-query";
import { StoreContext } from "storeon/react";
import { App as KonstaApp } from "konsta/react";
import "@/styles/tailwind.css";

export default function App(props: AppProps) {
  const queryClient = useMemo(
    () => createQueryClient(),
    [store.get()?.access_token?.token]
  );
  const trpcClient = useMemo(
    () => createTrpcClient(),
    [store.get()?.access_token?.token]
  );
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
