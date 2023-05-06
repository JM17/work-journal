import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getCustomer } from "~/model/customer.server";
import { useLoaderData } from "@remix-run/react";

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
    <div>
      <h1>{customer?.name}</h1>
    </div>
  );
}
