import { Form, useNavigation } from "@remix-run/react";
import FormContainer from "~/components/form-container";
import FormTitle from "~/components/form-title";
import Button from "~/components/buttons/button";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { badRequest } from "~/utils/request.server";
import { validateText } from "~/utils/validators";
import { createCustomer } from "~/model/customer.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const { name, email, title, role } = values;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof title !== "string" ||
    typeof role !== "string"
  ) {
    // throw new Error("Bad request");
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  const fieldErrors = {
    text: validateText(role),
  };
  const fields = { role };

  const hasErrors = Object.values(fieldErrors).some(Boolean);
  if (hasErrors) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  await createCustomer({
    name,
    email,
    title,
    role,
  });
  return redirect("/customers");
}

export default function NewCustomer() {
  const navigation = useNavigation();
  const state = navigation.state;

  const isSubmitting = state === "submitting";

  return (
    <FormContainer>
      <div>
        <FormTitle title={"Create a new customer"} />
        <Form method="post">
          <fieldset
            className="disabled:opacity-80"
            disabled={state === "submitting"}
          >
            <div>
              <input
                type="text"
                name="name"
                required
                placeholder={"Provide a name"}
                className="w-full rounded p-1 text-gray-900"
              />
            </div>
            <div className="mt-4">
              <input
                type="email"
                name="email"
                placeholder={"Provide an e-mail"}
                required
                className="w-full rounded p-1 text-gray-700"
              />
            </div>
            <div className="mt-4">
              <input
                type="text"
                name="title"
                placeholder={"Provide a title"}
                required
                className="w-full rounded p-1 text-gray-900"
              />
            </div>
            <div className="mt-4">
              <input
                type="text"
                name="role"
                placeholder={"Provide a role"}
                required
                className="w-full rounded p-1 text-gray-900"
              />
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
