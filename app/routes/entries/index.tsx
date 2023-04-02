import { PrismaClient } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { type ActionArgs, json, redirect } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { db } from "~/utils/db.server";
import { getUser, requireUserId } from "~/utils/session.server";
import { format, parseISO, startOfWeek } from "date-fns";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
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
      userId: userId,
    },
  });
}

function EntryList({
  entries,
  title,
}: {
  entries: { id: string; text: string }[];
  title: string;
}) {
  return (
    <div>
      <p>{title}</p>
      {entries.map((entry) => (
        <div key={entry.id}>
          <ul className="ml-8 list-disc">
            <li>
              <Link to={entry.id} className={"hover:text-gray-300"}>
                {entry.text}
              </Link>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  if (!user?.username || typeof user.id !== "string") {
    throw redirect(`/login`);
  }
  return json({
    entries: await db.entry.findMany({ where: { userId: user.id } }),
    user: user,
    orderBy: { date: "desc" },
  });
};

export default function EntriesIndexRoute() {
  const { entries } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [fetcher.state]);

  const entriesByWeek = entries.reduce<Record<string, typeof entries>>(
    (memo, entry) => {
      let sunday = startOfWeek(parseISO(entry.date));
      let sundayString = format(sunday, "yyyy-MM-dd");

      memo[sundayString] ||= [];
      memo[sundayString] = [...memo[sundayString], entry];

      return memo;
    },
    {}
  );

  const weeks = Object.keys(entriesByWeek)
    .sort((a, b) => a.localeCompare(b))
    .map((startingDate) => ({
      startingDate,
      work: entriesByWeek[startingDate].filter(
        (entry) => entry.type === "work"
      ),
      learnings: entriesByWeek[startingDate].filter(
        (entry) => entry.type === "learning"
      ),
      interestingThings: entriesByWeek[startingDate].filter(
        (entry) => entry.type === "interesting-thing"
      ),
    }));

  return (
    <div>
      <nav className="mt-6">
        <Link to="new" className={"text-blue-500 hover:text-blue-400"}>
          Add new entry
        </Link>
      </nav>

      <div className="space-y-16">
        {weeks.map((week) => (
          <div key={week.startingDate} className={"mt-6"}>
            <p className="font-bold">
              Week of February {format(parseISO(week.startingDate), "MMMM do")}
            </p>
            <div className="mt-3 space-y-4">
              {week.work.length > 0 && (
                <EntryList title={"Work"} entries={week.work} />
              )}
              {week.learnings.length > 0 && (
                <EntryList title={"Learnings"} entries={week.learnings} />
              )}
              {week.interestingThings.length > 0 && (
                <EntryList
                  title={"Interesting things"}
                  entries={week.interestingThings}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}