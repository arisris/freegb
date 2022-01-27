import GuestLayout from "@/components/layouts/Guest";
import Router from "next/router";
import useAuth from "@/libs/client/useAuth";
import { inferMutationInput } from "@/libs/client/trpc";
import { BlockTitle, Button, List, ListInput, Link } from "konsta/react";
import { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authRouterInputCreateSchema } from "@/libs/entity/auth/schema";

export default function PageRegister() {
  const { signInUp } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/"
  });
  const { handleSubmit, setError, control } = useForm<
    inferMutationInput<"auth.create">
  >({
    resolver: yupResolver(authRouterInputCreateSchema)
  });
  const onSubmit = (data: inferMutationInput<"auth.create">) => {
    signInUp(data).catch((e) => {
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
          <Link onClick={() => Router.push("/login")}>Login</Link>
        </div>
      }
    >
      <form method="POST" action="" onSubmit={handleSubmit(onSubmit)}>
        <BlockTitle className="text-xl">Register</BlockTitle>
        <List hairlines={false}>
          <Controller
            control={control}
            name="name"
            render={(f) => (
              <ListInput
                floatingLabel
                label="Name"
                type="text"
                error={f.fieldState.error?.message || null}
                name={f.field.name}
                placeholder="Jhon doe"
                value={f.field.value || ""}
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
            rules={{
              required: {
                value: true,
                message: "Password is required"
              }
            }}
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
          <Controller
            control={control}
            name="password_confirmation"
            rules={{
              required: {
                value: true,
                message: "Please confirm your password"
              }
            }}
            render={(f) => (
              <ListInput
                floatingLabel
                label="Confirm Password"
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
          <Button>Register</Button>
        </List>
      </form>
    </GuestLayout>
  );
}
