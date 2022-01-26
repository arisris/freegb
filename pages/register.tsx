import GuestLayout from "@/components/layouts/Guest";
import Router from "next/router";
import { inferMutationInput, trpc } from "@/libs/client/trpc";
import { BlockTitle, Button, List, ListInput, Link } from "konsta/react";
import { ChangeEvent, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useStoreon } from "storeon/react";
import { AppEvents, AppState } from "@/libs/client/store/types";
import { authLogin } from "@/libs/client/store/actions";

export default function PageRegister() {
  const {
    auth: { currentUser },
    dispatch
  } = useStoreon<AppState, AppEvents>("auth");
  const authCreate = trpc.useMutation("auth.create");
  useEffect(() => {
    if (currentUser) Router.push("/");
  }, [currentUser]);
  const { handleSubmit, setError, control } = useForm<inferMutationInput<"auth.create">>();
  const onSubmit = (data: inferMutationInput<"auth.create">) => {
    authCreate
      .mutateAsync(data)
      .then((i) => {
        dispatch(authLogin, i);
        Router.push("/")
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
            rules={{
              required: {
                value: true,
                message: "Please provide your name"
              }
            }}
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
