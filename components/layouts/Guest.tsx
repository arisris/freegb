import { Card, Preloader } from "konsta/react";
import Head from "next/head";
import Link from "next/link";

export default function GuestLayout(props: {
  children: JSX.Element | JSX.Element[];
  header?: JSX.Element | JSX.Element[];
  footer?: JSX.Element | JSX.Element[];
  title?: string;
  isLoading?: boolean;
}) {
  return (
    <>
      <Head>
        <title>{props.title || "Guest"}</title>
      </Head>
      <div className="absolute inset-0 flex flex-col justify-center items-center mx-2">
        <Card
          className="w-full sm:w-[480px]"
          header={!props.isLoading && props.header}
          footer={!props.isLoading && props.footer}
        >
          {props.isLoading ? (
            <div className="flex items-center flex-col gap-4">
              <Preloader />
              <p>Checking User</p>
            </div>
          ) : (
            props.children
          )}
        </Card>
        <div>
          <Link href="/">
            <a className="text-primary text-sm">Back to home</a>
          </Link>
        </div>
      </div>
    </>
  );
}
