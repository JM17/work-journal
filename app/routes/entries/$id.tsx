import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { useLoaderData, useNavigation } from "@remix-run/react";
import BackButton from "~/components/back-button";
import FormContainer from "~/components/form-container";
import FormTitle from "~/components/form-title";
import { format } from "date-fns";

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
  const entryDate = data?.date
    ? format(new Date(data?.date), "yyyy-MM-dd")
    : "";

  return (
    <FormContainer>
      <BackButton to={`/entries`} label={"Journal"} />
      <div>
        <FormTitle title={`Entry from ${entryDate}`} />
        <form method="put">
          <fieldset
            className="disabled:opacity-80"
            disabled={state === "submitting"}
          >
            <p>{data?.type}</p>
            <p>{data?.text}</p>
          </fieldset>
        </form>
      </div>
    </FormContainer>
  );
}
