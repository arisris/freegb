import {
  Card,
  Container,
  createStyles,
  Loader,
  MediaQuery,
  Paper
} from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";

const useStyles = createStyles((theme) => ({
  authWrapper: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
    marginRight: 4
  },
  cardAuth: {
    width: "100%",
    margin: `${theme.spacing.sm}px`,
    padding: 32,
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      width: 400
    }
  }
}));

export default function GuestLayout(
  props: PropsWithChildren<{
    children: ReactNode;
    header?: JSX.Element | JSX.Element[];
    footer?: JSX.Element | JSX.Element[];
    title?: string;
    isLoading?: boolean;
  }>
) {
  const { classes } = useStyles();
  return (
    <>
      <Head>
        <title>{props.title || "Guest"}</title>
      </Head>
      <div className={classes.authWrapper}>
        <Paper shadow={"xl"} className={classes.cardAuth}>
          {props.isLoading ? (
            <div className="flex items-center flex-col gap-4">
              <Loader />
              <p>Checking User</p>
            </div>
          ) : (
            props.children
          )}
        </Paper>
      </div>
    </>
  );
}
