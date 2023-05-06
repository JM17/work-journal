import FormContainer from "~/components/form-container";
import FormTitle from "~/components/form-title";
import type { ActionArgs } from "@remix-run/node";
import { createCustomer } from "~/model/customer.server";
import { makeDomainFunction } from "domain-functions";
import { formAction } from "~/form-action.server";
import Form from "~/components/form/form";
import { z } from "zod";

export const CustomerModel = z.object({
  name: z.string(),
  email: z.string().email(),
  title: z.string().min(3),
  role: z.string().min(3),
});

const hasId = z.object({ id: z.string() });

export const withId = CustomerModel.merge(hasId);

const mutation = makeDomainFunction(CustomerModel)(
  async (values) => await createCustomer(values)
);

export async function action({ request }: ActionArgs) {
  return formAction({
    request,
    schema: CustomerModel,
    mutation,
    successPath: "/customers",
  });
}

export default function NewCustomer() {
  return (
    <FormContainer>
      <FormTitle title={"Create a new customer"} />
      <Form schema={CustomerModel} />
    </FormContainer>
  );
}
