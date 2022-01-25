import { removeCurrentUser, setCurrentUser } from "@/libs/client/store/actions";
import { AppEvents, AppState } from "@/libs/client/store/types";
import { Button } from "konsta/react";
import { useRouter } from "next/router";
import { useStoreon } from "storeon/react";
export default function index() {
  const { currentUser, dispatch } = useStoreon<AppState, AppEvents>(
    "currentUser"
  );
  const router = useRouter();
  return (
    <div>
      <h3>Hello World</h3>
      {currentUser ? (
        <>
          <pre>{JSON.stringify(currentUser, null, 2)}</pre>
          <br />
          <Button
            onClick={() =>
              dispatch(removeCurrentUser, { redirectTo: "/login" })
            }
          >
            SignOut
          </Button>
        </>
      ) : (
        <Button onClick={() => router.push("/login")}>Login</Button>
      )}
    </div>
  );
}
