import {
  Card,
  Container,
  createStyles,
  Loader,
  MediaQuery,
  Paper,
  Box
} from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";

export default function GuestLayout(
  props: PropsWithChildren<{
    children: ReactNode;
    header?: JSX.Element | JSX.Element[];
    footer?: JSX.Element | JSX.Element[];
    title?: string;
    isLoading?: boolean;
  }>
) {
  return (
    <>
      <Head>
        <title>{"Authentication"}</title>
      </Head>
      <Box
        sx={() => ({
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 4,
          marginRight: 4
        })}
      >
        <Paper
          shadow={"xl"}
          sx={(theme) => ({
            width: "100%",
            margin: `${theme.spacing.sm}px`,
            padding: 32,
            [theme.fn.largerThan("sm")]: {
              width: 400
            }
          })}
        >
          {props.children}
        </Paper>
      </Box>
    </>
  );
}
