import useAuth from "@/libs/client/useAuth";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Group,
  Menu,
  Paper,
  Text,
  useMantineColorScheme
} from "@mantine/core";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, ReactNode } from "react";
import {
  AiOutlineBell,
  AiOutlineLogin,
  AiOutlineSetting,
  AiOutlineUser
} from "react-icons/ai";

export default function HomeLayout(
  props: PropsWithChildren<{
    children: ReactNode;
    header?: JSX.Element | JSX.Element[];
    footer?: JSX.Element | JSX.Element[];
    title?: string;
    isLoading?: boolean;
  }>
) {
  const scheme = useMantineColorScheme();
  const router = useRouter();
  const {
    auth: { data: user }
  } = useAuth();
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
        <title>{props.title || "Homepage"}</title>
      </Head>
      <Paper
        component="nav"
        shadow={"sm"}
        sx={{
          minHeight: "48px",
          display: "flex",
          minWidth: "100%",
          alignItems: "center"
        }}
      >
        <Container
          size="xl"
          sx={(theme) => ({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: 8
          })}
        >
          <Box>Logo</Box>
          {/* <Box>Forms</Box> */}
          {user ? (
            <Group spacing={"md"} position="center">
              <Menu
                control={
                  <ActionIcon size="md" variant="hover">
                    <AiOutlineBell size={24} />
                  </ActionIcon>
                }
                transition={"skew-down"}
                position="bottom"
                placement="center"
                withArrow
                gutter={-5}
              >
                <Menu.Label>User menu</Menu.Label>
                <Menu.Item>Settings</Menu.Item>
              </Menu>
              <Menu
                control={
                  <Button
                    leftIcon={
                      <Avatar src={user.avatar} size={"sm"} radius={"xl"}>
                        US
                      </Avatar>
                    }
                    styles={{
                      root: {
                        paddingLeft: 0,
                        paddingTop: 0,
                        paddingBottom: 0
                      }
                    }}
                    radius={"xl"}
                    variant="subtle"
                  >
                    <Text size="md">{user.name}</Text>
                  </Button>
                }
                position="bottom"
                placement="start"
                withArrow
                gutter={-5}
              >
                <Menu.Label>User menu</Menu.Label>
                <Menu.Item>Settings</Menu.Item>
              </Menu>
            </Group>
          ) : (
            <Group spacing={"md"}>
              <Menu
                control={
                  <ActionIcon size="md" variant="hover">
                    <AiOutlineLogin size={24} />
                  </ActionIcon>
                }
                position="left"
                withArrow
              >
                <Menu.Item onClick={() => router.push("/login")}>
                  Login
                </Menu.Item>
                <Menu.Item onClick={() => router.push("/login")}>
                  Register
                </Menu.Item>
              </Menu>
            </Group>
          )}
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
      <Box component="footer">
        <Container size={"xl"}>Footer</Container>
      </Box>
    </Box>
  );
}
