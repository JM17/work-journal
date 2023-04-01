import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useActionData, useFetcher } from "@remix-run/react";

import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { PrismaClient } from "@prisma/client";
import { badRequest } from "~/utils/request.server";

function validateText(content: string) {
  if (content.length < 3) {
    return "Text is too short";
  }
}

export async function action({ request }: ActionArgs) {
  let db = new PrismaClient();

  let formData = await request.formData();
  let values = Object.fromEntries(formData);
  let { date, type, text } = values;

  // this slows down the request, so we can see the loading state
  await new Promise((resolve) => setTimeout(resolve, 1000));

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
  if (Object.entries(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields, formError: null });
  }

  const entry = await db.entry.create({
    data: {
      date: new Date(date),
      type: type,
      text: text,
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
    <div className="p=6 mx-auto max-w-7xl">
      <nav>
        <Link to="/">Back home</Link>
      </nav>
      <p>Create a new entry</p>
      {/*<fetcher.Form method="post" className="mt-2">*/}
      <form method="post" className="mt-2">
        <fieldset
          className="disabled:opacity-80"
          disabled={fetcher.state === "submitting"}
        >
          <div>
            <label>
              Name:{" "}
              <input
                type="date"
                name="date"
                required
                className="text-gray-900"
                defaultValue={format(new Date(), "yyyy-MM-dd")}
              />
            </label>
          </div>
          <div>
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
          <div>
            <label>
              Content:
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
                className="w-full text-gray-700"
              />
            </label>
            {actionData?.fieldErrors?.text ? (
              <p id="text-error" role={"alert"}>
                {actionData?.fieldErrors.text}
              </p>
            ) : null}
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 px-4 py-1 font-semibold text-white"
            >
              {fetcher.state === "submitting" ? "Saving..." : "Save"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
