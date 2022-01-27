import GuestLayout from "@/components/layouts/Guest";
import Router from "next/router";
import { inferMutationInput } from "@/libs/client/trpc";
import { BlockTitle, Button, List, ListInput, Link } from "konsta/react";
import { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useAuth from "@/libs/client/useAuth";
import { authRouterInputTokenSchema } from "@/libs/entity/auth/schema";

export default function PageLogin() {
  const { signIn } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/"
  });
  const { handleSubmit, control, setError } = useForm<
    inferMutationInput<"auth.token">
  >({
    resolver: yupResolver(authRouterInputTokenSchema)
  });

  const onSubmit = (data: inferMutationInput<"auth.token">) => {
    signIn(data).catch((e) => {
      let v = e.data?.yupError;
      if (v) {
        setError(v.path, { message: v.errors.join(" ") });
      }
    });
  };
  return (
    <GuestLayout
      footer={
        <div className="flex flex-col my-4 items-center justify-center">
          <Link onClick={() => Router.push("/register")}>Register</Link>
        </div>
      }
    >
      <form method="POST" action="" onSubmit={handleSubmit(onSubmit)}>
        <BlockTitle className="text-xl">Login</BlockTitle>
        <List hairlines={false}>
          <Controller
            control={control}
            name="email"
            render={(f) => (
              <ListInput
                floatingLabel
                label="Email"
                type="email"
                error={f.fieldState.error?.message || null}
                name={f.field.name}
                placeholder="jhon.doe@example.net"
                value={f.field.value || ""}
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
              <ListInput
                floatingLabel
                label="Password"
                type="password"
                error={f.fieldState.error?.message || null}
                placeholder="***"
                value={f.field.value || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  f.field.onChange(e.target.value)
                }
              />
            )}
          />
        </List>
        <List inset>
          <Button>Login</Button>
        </List>
      </form>
    </GuestLayout>
  );
}
