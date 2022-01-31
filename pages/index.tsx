import useAuth from "@/libs/client/useAuth";
import { useRouter } from "next/router";
import { Button, Code } from "@mantine/core";
import HomeLayout from "@/components/layouts/Home";
export default function index() {
  const { user: currentUser, signOut } = useAuth();

  const router = useRouter();
  return (
    <HomeLayout>
      <h3>Hello World</h3>
      {currentUser ? (
        <>
          <Code>
            <pre>{JSON.stringify(currentUser, null, 2)}</pre>
          </Code>
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
    </HomeLayout>
  );
}
