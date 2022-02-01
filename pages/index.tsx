import useAuth from "@/libs/client/useAuth";
import { useRouter } from "next/router";
import { Button, Code, Group } from "@mantine/core";
import HomeLayout from "@/components/layouts/Home";
import { useEffect, useState } from "react";
export default function index() {
  const [count, setCount] = useState(0);
  const { auth, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.push("?count=" + count);
  }, [count]);

  return (
    <HomeLayout>
      <h3>Hello World</h3>
      {auth.data && (
        <>
          <Code>
            <pre>{JSON.stringify(auth.data, null, 2)}</pre>
          </Code>
          <br />
          <Group spacing={20}>
            <Button onClick={() => signOut("/login")}>SignOut</Button>
            <Button onClick={() => setCount(count + 1)}>ADD</Button>
          </Group>
        </>
      )}
    </HomeLayout>
  );
}
