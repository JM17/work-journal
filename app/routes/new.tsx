import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useActionData, useFetcher } from "@remix-run/react";

import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { PrismaClient } from "@prisma/client";
import { badRequest } from "~/utils/request.server";
import { requireUserId } from "~/utils/session.server";

function validateText(content: string) {
  if (content.length < 3) {
    return "Text is too short";
  }
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);
  const db = new PrismaClient();

  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const { date, type, text } = values;

  if (
    typeof date !== "string" ||
    typeof type !== "string" ||
    typeof text !== "string"
  ) {
    // throw new Error("Bad request");
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  const fieldErrors = {
    text: validateText(text),
  };
  const fields = { text };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const entry = await db.entry.create({
    data: {
      date: new Date(date),
      type: type,
      text: text,
      userId: userId,
    },
  });
  return redirect(`/${entry.id}`);
}

export default function NewEntryRoute() {
  let fetcher = useFetcher();
  const actionData = useActionData<typeof action>();
  let textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (fetcher.state === "submitting" && textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [fetcher.state]);

  return (
    <div className={"mx-auto max-w-7xl p-10"}>
      <div className="p=6 max-w-2xl">
        <nav>
          <Link
            to="/"
            className={
              "inline-flex items-center text-blue-500 hover:text-blue-400"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-1 h-4 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Journal
          </Link>
        </nav>
        <div className="my-2 rounded-xl border border-gray-700  p-3">
          <h2 className="text-xl">Create a new entry</h2>
          <form method="post" className="mt-6">
            <fieldset
              className="disabled:opacity-80"
              disabled={fetcher.state === "submitting"}
            >
              <div>
                <input
                  type="date"
                  name="date"
                  required
                  className="rounded text-gray-900"
                  defaultValue={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
              <div className={"mt-4 space-x-4"}>
                <label className="inline-block">
                  <input
                    required
                    type="radio"
                    defaultChecked
                    className="mr-1"
                    name="type"
                    value="work"
                  />
                  Work
                </label>
                <label className="inline-block">
                  <input
                    type="radio"
                    className="mr-1"
                    name="type"
                    value="learning"
                  />
                  Learning
                </label>
                <label className="inline-block">
                  <input
                    type="radio"
                    className="mr-1"
                    name="type"
                    value="interesting-thing"
                  />
                  Interesting thing
                </label>
              </div>
              <div className="mt-4">
                <textarea
                  ref={textareaRef}
                  defaultValue={actionData?.fields?.text}
                  aria-invalid={
                    Boolean(actionData?.fieldErrors?.text) || undefined
                  }
                  aria-errormessage={
                    actionData?.fieldErrors?.text ? "text-error" : undefined
                  }
                  name="text"
                  required
                  placeholder="Type your entry..."
                  className="w-full rounded text-gray-700"
                />
                {actionData?.fieldErrors?.text ? (
                  <p id="text-error" role={"alert"}>
                    {actionData?.fieldErrors.text}
                  </p>
                ) : null}
              </div>
              <div className={"mt-2 text-right"}>
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-6 py-1 font-semibold text-white hover:bg-blue-400"
                >
                  {fetcher.state === "submitting" ? "Saving..." : "Save"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
