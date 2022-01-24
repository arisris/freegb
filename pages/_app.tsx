import { AppRouter } from "@/libs/api/routers";
import { withTRPC } from "@trpc/next";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { httpLink } from "@trpc/client/links/httpLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { App as KonstaApp } from "konsta/react";
import { AppProps } from "next/app";

import "@/styles/tailwind.css";
import { transformer } from "@/libs/client/trpc";

function getBaseUrl() {
  if (process.browser) {
    return "";
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <KonstaApp theme="material" safeAreas={true}>
      <Component {...pageProps} />
    </KonstaApp>
  );
}

const trpcApp = withTRPC<AppRouter>({
  config() {
    return {
      links: [
        splitLink({
          condition(op) {
            return op.context.skipBatchLink === true;
          },
          true: httpLink({ url: `${getBaseUrl()}/api/trpc` }),
          false: httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })
        })
      ],
      transformer
    };
  },
  ssr: true,
  responseMeta({ clientErrors }) {
    if (clientErrors.length) {
      return {
        status: clientErrors[0].data?.httpStatus ?? 500
      };
    }
    return {};
  }
})(App);

export default trpcApp;
