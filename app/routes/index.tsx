import { PrismaClient } from "@prisma/client";
import { type ActionArgs, json, LoaderArgs, redirect } from "@remix-run/node";
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

export default function Index() {
  const { entries, user } = useLoaderData<typeof loader>();

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
    <div className="mx-auto max-w-7xl p-10">
      {user?.username && (
        <div className={"mb-4 flex align-middle"}>
          <h3 className={"flex-grow"}>
            Welcome, <b>{user?.username}</b>
          </h3>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="inline-flex items-center  text-gray-400 hover:text-gray-300"
            >
              Logout
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ml-1 h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
      <h1 className="text-5xl">Work Journal</h1>
      <p className="mt-2 text-lg text-gray-400">
        Learnings and doings. Updated weekly.
      </p>

      <nav className="mt-6">
        <Link
          to="/new"
          className={"flex items-center text-blue-500 hover:text-blue-400"}
        >
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
                <div>
                  <p>Work</p>
                  {week.work.map((entry) => (
                    <div key={entry.id}>
                      <ul className="ml-8 list-disc">
                        <li>
                          <Link to={`/${entry.id}`}>{entry.text}</Link>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {week.learnings.length > 0 && (
                <div>
                  <p>Learnings</p>
                  {week.learnings.map((entry) => (
                    <div key={entry.id}>
                      <ul className="ml-8 list-disc">
                        <li>
                          <Link to={`/${entry.id}`}>{entry.text}</Link>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {week.interestingThings.length > 0 && (
                <div>
                  <p>Interesting things</p>
                  {week.interestingThings.map((entry) => (
                    <div key={entry.id}>
                      <ul className="ml-8 list-disc">
                        <li>
                          <Link to={`/${entry.id}`}>{entry.text}</Link>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
