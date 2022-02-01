import GuestLayout from "@/components/layouts/Guest";
import { inferMutationInput } from "@/libs/client/trpc";
import useAuth from "@/libs/client/useAuth";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  authRouterInputCreateSchema,
  authRouterInputTokenSchema
} from "@/libs/entity/auth/schema";
import {
  Anchor,
  Button,
  Group,
  LoadingOverlay,
  PasswordInput,
  TextInput
} from "@mantine/core";
import { ChangeEvent, useEffect, useState } from "react";
import { useNotifications } from "@mantine/notifications";
import Link from "next/link";

export default function PageRegister() {
  const { signInUp, auth } = useAuth({
    middleware: "guest",
    redirectTo: "/"
  });
  const [isLoading, setIsLoading] = useState(false);

  const notif = useNotifications();

  const { handleSubmit, control, setError, formState } = useForm<
    inferMutationInput<"auth.create">
  >({
    resolver: yupResolver(authRouterInputCreateSchema)
  });
  const onSubmit = (data: inferMutationInput<"auth.create">) => {
    setIsLoading(true);
    signInUp(data)
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
      <LoadingOverlay visible={auth.isLoading || isLoading || formState.isSubmitting || formState.isValidating} />
      <form method="POST" action="" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="name"
          render={(f) => (
            <TextInput
              id="name"
              label="Name"
              error={f.fieldState.error?.message || null}
              name={f.field.name}
              autoComplete="new-email"
              placeholder="John Doe"
              defaultValue={f.field.value || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                f.field.onChange(e.target.value)
              }
            />
          )}
        />
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
              autoComplete="new-email"
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
              placeholder="Password"
              defaultValue={f.field.value || ""}
              autoComplete="new-password"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                f.field.onChange(e.target.value)
              }
            />
          )}
        />
        <Controller
          control={control}
          name="password_confirmation"
          render={(f) => (
            <PasswordInput
              id="password-confirmation"
              label="Confirm Password"
              error={f.fieldState.error?.message || null}
              placeholder="Confirm"
              defaultValue={f.field.value || ""}
              autoComplete="new-password"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                f.field.onChange(e.target.value)
              }
            />
          )}
        />
        <Group align={"center"} position={"apart"} mt={20}>
          <Link href={"/login"}>
            <Anchor component="a">Login</Anchor>
          </Link>
          <Button type="submit">Register</Button>
        </Group>
      </form>
    </GuestLayout>
  );
}
