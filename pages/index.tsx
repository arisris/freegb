import useAuth from "@/libs/client/useAuth";
import { Button } from "konsta/react";
import { useRouter } from "next/router";
export default function index() {
  const { user: currentUser, signOut } = useAuth();

  const router = useRouter();
  return (
    <div>
      <h3>Hello World</h3>
      {currentUser ? (
        <>
          <pre>{JSON.stringify(currentUser, null, 2)}</pre>
          <br />
          <div className="w-48">
            <Button onClick={() => signOut("/login")}>SignOut</Button>
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
