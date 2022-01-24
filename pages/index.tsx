import { trpc } from "@/libs/client/trpc";
import { useEffect } from "react";
export default function index() {
  const { data: users } = trpc.useQuery(["users.all"]);
  return <div>{users ? users.map((i, key) => <div key={key}>
    <p>{i.name}</p>
    <p>{i.createdAt.toDateString()}</p>
  </div>) : null}</div>;
}
