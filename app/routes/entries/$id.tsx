import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import BackButton from "~/components/back-button";
import FormContainer from "~/components/form-container";
import FormTitle from "~/components/form-title";
import { format } from "date-fns";
import { PrismaClient } from "@prisma/client";
import { badRequest } from "~/utils/request.server";
import { useEffect, useRef } from "react";
import { validateText } from "~/utils/validators";

export async function action({ request }: ActionArgs) {
  const db = new PrismaClient();

  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const { date, type, text, id } = values;

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

  await db.entry.update({
    where: { id: id as string },
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });
  return redirect("/entries");
}

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.id as string;
  const entry = await db.entry.findUnique({
    where: { id: id },
  });
  return json(entry);
};

export default function EntryRoute() {
  const { state } = useNavigation();
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  let textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state === "submitting" && textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [state]);

  return (
    <FormContainer>
      <BackButton to={`/entries`} label={"Journal"} />
      <div>
        <FormTitle title={"Edit entry"} />
        <form method="post">
          <fieldset
            className="disabled:opacity-80"
            disabled={state === "submitting"}
          >
            <input type="hidden" name="id" defaultValue={data?.id} />
            <div>
              <input
                type="date"
                name="date"
                required
                className="rounded text-gray-900"
                defaultValue={format(new Date(data?.date || ""), "yyyy-MM-dd")}
              />
            </div>
            <div className={"mt-4 space-x-4"}>
              <label className="inline-block">
                <input
                  required
                  type="radio"
                  defaultChecked={data?.type === "work"}
                  className="mr-1"
                  name="type"
                  value="work"
                />
                Work
              </label>
              <label className="inline-block">
                <input
                  type="radio"
                  defaultChecked={data?.type === "learning"}
                  className="mr-1"
                  name="type"
                  value="learning"
                />
                Learning
              </label>
              <label className="inline-block">
                <input
                  type="radio"
                  defaultChecked={data?.type === "interesting-thing"}
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
                defaultValue={data?.text}
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
                {state === "submitting" ? "Saving..." : "Save"}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </FormContainer>
  );
}
