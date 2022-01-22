import Document, { Html, Head, Main, NextScript } from "next/document";
export default class MyDocument extends Document {
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
