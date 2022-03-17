import store from "@/libs/client/store";
import { createQueryClient, createTrpcClient, trpc } from "@/libs/client/trpc";
import { AppProps } from "next/app";
import { ReactElement, useCallback, useMemo, useState } from "react";
import { QueryClientProvider } from "react-query";
import { StoreContext } from "storeon/react";
import {
  ColorScheme,
  ColorSchemeProvider,
  LoadingOverlay,
  MantineProvider
} from "@mantine/core";
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
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = useCallback(() => {
    if (colorScheme === "dark") setColorScheme("light");
    if (colorScheme === "light") setColorScheme("dark");
  }, [colorScheme]);
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
          <ColorSchemeProvider
            colorScheme="light"
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider withGlobalStyles withNormalizeCSS theme={{}}>
              <ModalsProvider>
                <NotificationsProvider>
                  <props.Component {...props.pageProps} />
                </NotificationsProvider>
              </ModalsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </StoreContext.Provider>
  );
}
