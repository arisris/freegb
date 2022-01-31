import Document, { Html, Head, Main, NextScript } from "next/document";
import { createGetInitialProps } from "@mantine/next";
const getInitialProps = createGetInitialProps();
export default class MyDocument extends Document {
  static getInitialProps = getInitialProps;
  render() {
    return (
      <Html lang="en">
        <Head>
          <link href="/favicon.ico" rel="shortcut icon" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body className="bg-gray-100 text-gray-700">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
