import type { LoaderArgs } from "@remix-run/node";
import { type ActionArgs, json, redirect } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { getUser, requireUserId } from "~/utils/session.server";
import { format, parseISO, startOfWeek } from "date-fns";
import { createEntry, deleteEntry, getEntries } from "~/model/entry.server";
import NavButton from "~/components/buttons/nav-button";
import RemoveButton from "~/components/buttons/remove-button";
import { AnimatePresence, motion } from "framer-motion";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const { date, type, text, intent, id } = Object.fromEntries(formData);

  if (intent === "delete") {
    await deleteEntry(id as string);
    return redirect("/entries");
  }

  if (
    typeof date !== "string" ||
    typeof type !== "string" ||
    typeof text !== "string"
  ) {
    throw new Error("Bad request");
  }

  return createEntry({
    date: new Date(date),
    type: type,
    text: text,
    userId: userId,
  });
}

type LoaderData = {
  entries: Awaited<ReturnType<typeof getEntries>>;
  user: Awaited<ReturnType<typeof getUser>>;
  orderBy: { date: "asc" | "desc" };
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  if (!user?.username || typeof user.id !== "string") {
    throw redirect(`/login`);
  }
  const entries = await getEntries(user.id);
  return json<LoaderData>({
    entries: entries,
    user: user,
    orderBy: { date: "desc" },
  });
};

type EntryListProps = {
  entries: { id: string; text: string }[];
  title: string;
};
function EntryList({ entries, title }: EntryListProps) {
  return (
    <div>
      <p>{title}</p>
      <div>
        <ul className="ml-8 list-disc">
          <AnimatePresence>
            {entries.map((entry) => (
              <motion.li
                key={entry.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 24, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <span className={"inline-flex items-baseline"}>
                  <Link
                    to={entry.id}
                    prefetch={"intent"}
                    className={"mr-2 hover:text-gray-300"}
                  >
                    {entry.text}
                  </Link>
                  <RemoveButton id={entry.id} />
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

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
      <div className="mt-6">
        <NavButton to={"new"} label={"Add new entry"} />
      </div>
      <div className="space-y-16">
        {weeks.map((week) => (
          <div key={week.startingDate} className={"mt-6"}>
            <p className="font-bold">
              Week of {format(parseISO(week.startingDate), "MMMM do")}
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
