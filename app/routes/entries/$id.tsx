import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import NavButton, { BackIcon } from "~/components/buttons/nav-button";
import FormContainer from "~/components/form-container";
import FormTitle from "~/components/form-title";
import { format } from "date-fns";
import { badRequest } from "~/utils/request.server";
import { useEffect, useRef } from "react";
import { validateText } from "~/utils/validators";
import { getEntry, updateEntry } from "~/model/entry.server";
import SubmitButton from "~/components/buttons/submit-button";

export async function action({ request }: ActionArgs) {
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

  await updateEntry(id as string, {
    date: new Date(date),
    type: type,
    text: text,
  });
  return redirect("/entries");
}

type LoaderData = Awaited<ReturnType<typeof getEntry>>;

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.id as string;
  const entry = await getEntry(id);
  return json<LoaderData>(entry);
};

export default function EntryRoute() {
  const { state } = useNavigation();
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isSubmitting = state === "submitting";

  useEffect(() => {
    if (isSubmitting && textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [isSubmitting]);

  return (
    <FormContainer>
      <NavButton to={`/entries`} label={"Journal"} leftIcon={<BackIcon />} />
      <div>
        <FormTitle title={"Edit entry"} />
        <Form method="post">
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
              <SubmitButton isSubmitting={isSubmitting} />
            </div>
          </fieldset>
        </Form>
      </div>
    </FormContainer>
  );
}
