import GuestLayout from "@/components/layouts/Guest";
import Router from "next/router";
import { trpc } from "@/libs/client/trpc";
import { BlockTitle, Button, List, ListInput, Link } from "konsta/react";
import { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthCreateInput } from "@/libs/api/routers/auth";

export default function PageRegister() {
  const authCreate = trpc.useMutation("auth.create");

  const { handleSubmit, setError, control } =
    useForm<AuthCreateInput>();
  const onSubmit = (data: AuthCreateInput) => {
    console.log(data);
    authCreate
      .mutateAsync(data)
      .then((i) => {
        console.log(i);
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
          <Button>Login</Button>
        </List>
      </form>
    </GuestLayout>
  );
}
