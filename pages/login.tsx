import GuestLayout from "@/components/layouts/Guest";
import Router from "next/router";
import { trpc } from "@/libs/client/trpc";
import { BlockTitle, Button, List, ListInput, Link } from "konsta/react";
import { ChangeEvent, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthTokenInput } from "@/libs/api/routers/auth";
import { useStoreon } from "storeon/react";
import { AppEvents, AppState } from "@/libs/client/store/types";
import { setToken } from "@/libs/client/store/actions";

export default function PageLogin() {
  const { dispatch, currentUser } = useStoreon<AppState, AppEvents>(
    "currentUser"
  );
  const authToken = trpc.useMutation("auth.token");

  const { handleSubmit, control, setError } = useForm<AuthTokenInput>();
  useEffect(() => {
    if (currentUser) Router.push("/");
  }, [currentUser]);
  const onSubmit = (data: AuthTokenInput) => {
    authToken
      .mutateAsync(data)
      .then((i) => {
        dispatch(setToken, i.token);
        Router.reload();
      })
      .catch((e) => {
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
            rules={{
              required: {
                value: true,
                message: "Email is required"
              }
            }}
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
        </List>
        <List inset>
          <Button>Login</Button>
        </List>
      </form>
    </GuestLayout>
  );
}
