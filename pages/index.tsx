import { authLogout } from "@/libs/client/store/actions";
import { AppEvents, AppState } from "@/libs/client/store/types";
import { Button } from "konsta/react";
import { useRouter } from "next/router";
import { useStoreon } from "storeon/react";
export default function index() {
  const {
    auth: { currentUser },
    dispatch
  } = useStoreon<AppState, AppEvents>("auth");
  const router = useRouter();
  return (
    <div>
      <h3>Hello World</h3>
      {currentUser ? (
        <>
          <pre>{JSON.stringify(currentUser, null, 2)}</pre>
          <br />
          <div className="w-48">
            <Button
              onClick={() => dispatch(authLogout, { redirectTo: "/login" })}
            >
              SignOut
            </Button>
          </div>
        </>
      ) : (
        <div className="w-48">
          <Button onClick={() => router.push("/login")}>Login</Button>
        </div>
      )}
    </div>
  );
}
