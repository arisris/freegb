import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useStoreon } from "storeon/react";
import { setAccessToken } from "./store/actions";
import { AppEvents, AppState } from "./store/types";
import { createTrpcClient, inferMutationInput, trpc } from "./trpc";

export type UseAuthParams = {
  redirectTo?: string;
  middleware?: "guest" | "auth";
};

export default function useAuth({
  redirectTo,
  middleware
}: UseAuthParams = {}) {
  const router = useRouter();
  const trpcClient = useMemo(() => createTrpcClient(), []);
  const { access_token, dispatch } = useStoreon<AppState, AppEvents>(
    "access_token"
  );
  const auth = trpc.useQuery(["users.me", null], {
    context: { skipBatchLink: true },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (access_token) {
      let tid = setInterval(() => {
        /** let check token are still valid every 10sec in background **/
        if (Date.now() > access_token?.exp * 1000) {
          auth.refetch();
        }
      }, 1000 * 10);
      return () => tid && clearInterval(tid);
    }
  }, [access_token?.token, auth.isRefetching]);

  const signIn = async (input: inferMutationInput<"auth.token">) => {
    const data = await trpcClient.mutation("auth.token", input);
    dispatch(setAccessToken, data);
    auth.refetch();
    return data;
  };
  const signInUp = async (input: inferMutationInput<"auth.create">) => {
    const data = await trpcClient.mutation("auth.create", input);
    dispatch(setAccessToken, data);
    auth.refetch();
    return data;
  };
  const signOut = (redirectTo: string = null) => {
    dispatch(setAccessToken, null);
    if (redirectTo) router.push(redirectTo);
  };

  useEffect(() => {
    if (middleware === "guest" && redirectTo && auth.data)
      router.push(redirectTo);
    if (middleware === "auth" && redirectTo && !auth.data)
      router.push(redirectTo);
  }, [auth.data]);

  return {
    auth,
    signIn,
    signInUp,
    signOut
  };
}
