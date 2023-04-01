import { json, LoaderArgs } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.id as string;
  const entry = await db.entry.findUnique({
    where: { id: id },
  });
  return json(entry);
};

export default function EntryRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <nav>
        <Link to="/">Back home</Link>
      </nav>
      <p>{data?.type}</p>
      <p>{data?.text}</p>
    </div>
  );
}
