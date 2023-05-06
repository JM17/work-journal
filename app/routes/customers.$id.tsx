import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getCustomer, updateCustomer } from "~/model/customer.server";
import { useLoaderData } from "@remix-run/react";
import FormContainer from "~/components/form-container";
import FormTitle from "~/components/form-title";
import Form from "~/components/form/form";
import { withId } from "~/routes/customers.new";
import { makeDomainFunction } from "domain-functions";
import { formAction } from "~/form-action.server";

const mutation = makeDomainFunction(withId)(
  async (values) => await updateCustomer(values.id, values)
);

export async function action({ request }: ActionArgs) {
  return formAction({
    request,
    schema: withId,
    mutation,
  });
}

type LoaderData = {
  customer: Awaited<ReturnType<typeof getCustomer>>;
};
export const loader = async ({ params }: LoaderArgs) => {
  const id = params.id as string;
  const customer = await getCustomer(id);
  return json<LoaderData>({
    customer: customer,
  });
};

export default function User() {
  const customer = useLoaderData<LoaderData>().customer;

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <FormContainer>
      <FormTitle title={"Edit customer"} />
      <Form schema={withId} values={customer} hiddenFields={["id"]} />
    </FormContainer>
  );
}
