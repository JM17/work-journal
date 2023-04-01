import { PrismaClient } from "@prisma/client";
import { type ActionArgs, json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { db } from "~/utils/db.server";

export async function action({ request }: ActionArgs) {
  let db = new PrismaClient();

  let formData = await request.formData();
  let { date, type, text } = Object.fromEntries(formData);

  if (
    typeof date !== "string" ||
    typeof type !== "string" ||
    typeof text !== "string"
  ) {
    throw new Error("Bad request");
  }

  return db.entry.create({
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });
}

export const loader = async () => {
  return json({
    notes: await db.entry.findMany(),
    orderBy: { date: "desc" },
  });
};

export default function Index() {
  let fetcher = useFetcher();

  const data = useLoaderData<typeof loader>();
  let textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [fetcher.state]);

  return (
    <div className="mx-auto max-w-7xl p-10">
      <h1 className="text-5xl">Work Journal</h1>
      <p className="mt-2 text-lg text-gray-400">
        Learnings and doings. Updated weekly.
      </p>

      <nav>
        <Link to="/new">Add entry</Link>
      </nav>

      <div className="mt-6">
        <p className="font-bold">
          Week of February 27<sup>th</sup>
        </p>

        <div className="mt-3 space-y-4">
          {data.notes.map((note) => (
            <div key={note.id}>
              <p>{note.type}</p>
              <ul className="ml-8 list-disc">
                <li>
                  <Link to={`/${note.id}`}>{note.text}</Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
