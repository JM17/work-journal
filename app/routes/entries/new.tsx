import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { badRequest } from "~/utils/request.server";
import { requireUserId } from "~/utils/session.server";
import FormContainer from "~/components/form-container";
import FormTitle from "~/components/form-title";
import { validateText } from "~/utils/validators";
import { createEntry } from "~/model/entry.server";
import Button from "~/components/buttons/button";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

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

  const hasErrors = Object.values(fieldErrors).some(Boolean);
  if (hasErrors) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  await createEntry({
    date: new Date(date),
    type: type,
    text: text,
    userId: userId,
  });
  return redirect("/entries");
}

export default function NewEntryRoute() {
  const navigation = useNavigation();
  const state = navigation.state;
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
      <div>
        <FormTitle title={"Create a new entry"} />
        <Form method="post">
          <fieldset
            className="disabled:opacity-80"
            disabled={state === "submitting"}
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
                <p id="text-error" role={"alert"} className={"text-red-600"}>
                  {actionData?.fieldErrors.text}
                </p>
              ) : null}
            </div>
            <div className={"mt-2 text-right"}>
              <Button disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </fieldset>
        </Form>
      </div>
    </FormContainer>
  );
}
