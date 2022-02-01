import GuestLayout from "@/components/layouts/Guest";
import { inferMutationInput } from "@/libs/client/trpc";
import useAuth from "@/libs/client/useAuth";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authRouterInputTokenSchema } from "@/libs/entity/auth/schema";
import {
  Anchor,
  Button,
  Group,
  LoadingOverlay,
  PasswordInput,
  TextInput
} from "@mantine/core";
import { ChangeEvent, useState } from "react";
import { useNotifications } from "@mantine/notifications";
import Link from "next/link";

export default function PageLogin() {
  const { signIn, auth } = useAuth({
    middleware: "guest",
    redirectTo: "/"
  });
  const [isLoading, setIsLoading] = useState(false);

  const notif = useNotifications();

  const { handleSubmit, control, setError, formState } = useForm<
    inferMutationInput<"auth.token">
  >({
    resolver: yupResolver(authRouterInputTokenSchema)
  });

  const onSubmit = (data: inferMutationInput<"auth.token">) => {
    setIsLoading(true);
    signIn(data)
      .catch((e) => {
        let v = e.data?.yupError;
        if (v) {
          setError(v.path, { message: v.errors.join(" ") });
        } else {
          notif.showNotification({
            title: "Error!",
            message: e.message,
            color: "red"
          });
        }
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <GuestLayout>
      <LoadingOverlay visible={auth.isLoading || isLoading} />
      <form method="POST" action="" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="email"
          render={(f) => (
            <TextInput
              id="email"
              label="Email"
              type="email"
              error={f.fieldState.error?.message || null}
              name={f.field.name}
              placeholder="jhon.doe@example.net"
              defaultValue={f.field.value || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                f.field.onChange(e.target.value)
              }
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={(f) => (
            <PasswordInput
              id="password"
              label="Password"
              error={f.fieldState.error?.message || null}
              placeholder="***"
              defaultValue={f.field.value || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                f.field.onChange(e.target.value)
              }
            />
          )}
        />
        <Group align={"center"} position={"apart"} mt={20}>
          <Link href={"/register"}>
            <Anchor component="a">Register</Anchor>
          </Link>
          <Button type="submit">Login</Button>
        </Group>
      </form>
    </GuestLayout>
  );
}
