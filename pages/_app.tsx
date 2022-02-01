import store from "@/libs/client/store";
import { createQueryClient, createTrpcClient, trpc } from "@/libs/client/trpc";
import { AppProps } from "next/app";
import { ReactElement, useMemo } from "react";
import { QueryClientProvider } from "react-query";
import { StoreContext } from "storeon/react";
import { LoadingOverlay, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { NextComponentType } from "next";
import useAuth, { UseAuthParams } from "@/libs/client/useAuth";

type AppComponentTypeProps = NextComponentType & {
  authenticate?: UseAuthParams | boolean;
};
type AppPropsType = AppProps & {
  Component: AppComponentTypeProps;
};

export default function App(props: AppPropsType) {
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
          <MantineProvider withGlobalStyles withNormalizeCSS theme={{}}>
            <ModalsProvider>
              <NotificationsProvider>
                <props.Component {...props.pageProps} />
              </NotificationsProvider>
            </ModalsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </StoreContext.Provider>
  );
}
