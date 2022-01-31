import { Box, Container, Paper } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";

export default function HomeLayout(
  props: PropsWithChildren<{
    children: ReactNode;
    header?: JSX.Element | JSX.Element[];
    footer?: JSX.Element | JSX.Element[];
    title?: string;
    isLoading?: boolean;
  }>
) {
  return (
    <Box
      component="section"
      sx={(theme) => ({
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      })}
    >
      <Head>
        <title>{props.title || "Guest"}</title>
      </Head>
      <Paper component="nav" shadow={"xl"}>
        <Container
          size="xl"
          sx={(theme) => ({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10
          })}
        >
          <Box>Logo</Box>
          <Box>Nav</Box>
        </Container>
      </Paper>
      <Box
        component="section"
        sx={(theme) => ({
          flex: "auto"
        })}
      >
        <Container size={"xl"}>{props.children}</Container>
      </Box>
      <Box component="footer">Foot</Box>
    </Box>
  );
}
