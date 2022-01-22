import "@/styles/tailwind.css";
import { App as KonstaApp } from "konsta/react";
import { AppProps } from "next/app";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <KonstaApp theme="material" safeAreas={true}>
      <Component {...pageProps} />
    </KonstaApp>
  );
}
export default App;
