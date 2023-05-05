import type { ActionArgs } from "@remix-run/node";
import { useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { requireUserId } from "~/utils/session.server";
import FormContainer from "~/components/form-container";
import FormTitle from "~/components/form-title";
import { createEntry } from "~/model/entry.server";
import Form from "~/components/form/form";
import { z } from "zod";
import { makeDomainFunction } from "domain-functions";
import { formAction } from "~/form-action.server";

const schema = z.object({
  date: z.date().default(new Date()),
  type: z.enum(["work", "learning", "interesting-thing"]).default("work"),
  text: z.string().min(3),
});

const envSchema = z.object({
  userId: z.string(),
});

const mutation = makeDomainFunction(
  schema,
  envSchema
)(
  async (values, { userId }) =>
    await createEntry({
      ...values,
      userId: userId,
    })
);

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  return formAction({
    request,
    schema,
    mutation,
    environment: { userId },
    successPath: "/entries",
  });
}

export default function NewEntry() {
  const navigation = useNavigation();
  const state = navigation.state;
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
      <FormTitle title={"Create a new entry"} />
      <Form method="post" schema={schema}>
        {({ Field, Errors, Button }) => (
          <>
            <Field name="date" />
            <Field name="type" radio={true} />
            <Field name="text" placeholder="Type your entry..." multiline />
            <Button disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </>
        )}
      </Form>
    </FormContainer>
  );
}
