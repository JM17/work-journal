import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import FormContainer from "~/components/form-container";
import FormTitle from "~/components/form-title";
import { getEntry, updateEntry } from "~/model/entry.server";
import { makeDomainFunction } from "domain-functions";
import { withId } from "~/routes/entries.new";
import { formAction } from "~/form-action.server";
import Form from "~/components/form/form";

const mutation = makeDomainFunction(withId)(async (values) => {
  return await updateEntry(values.id as string, {
    ...values,
  });
});

export async function action({ request }: ActionArgs) {
  return formAction({
    request,
    schema: withId,
    mutation,
    successPath: "/entries",
  });
}

type LoaderData = Awaited<ReturnType<typeof getEntry>>;

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.id as string;
  const entry = await getEntry(id);
  return json<LoaderData>(entry);
};

export default function EntryRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <FormContainer>
      <FormTitle title={"Edit entry"} />
      <Form schema={withId} hiddenFields={["id"]} values={data || {}}>
        {({ Field, Errors, Button }) => (
          <>
            <Field name="id" />
            <Field name="date" />
            <Field name="type" radio={true} />
            <Field name="text" placeholder="Type your entry..." multiline />
            <Button />
            <Errors />
          </>
        )}
      </Form>
    </FormContainer>
  );
}
