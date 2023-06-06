import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { deleteCustomer, getCustomers } from "~/model/customer.server";
import IndexContainer from "~/components/index-container";
import Header from "~/components/header";
import AddButton from "~/components/buttons/add-button";
import RemoveButton from "~/components/buttons/remove-button";
import { CustomerModel } from "~/routes/customers.new";
import { objectFromSchema } from "~/utils/prelude";
import { SortableColumn } from "~/components/table/sortable-column";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { intent, id } = Object.fromEntries(formData);

  if (intent === "delete") {
    await deleteCustomer(id as string);
    return redirect("/customers");
  }
}

type LoaderData = {
  customers: Awaited<ReturnType<typeof getCustomers>>;
};

export const loader = async () => {
  const customers = await getCustomers();
  return json<LoaderData>({
    customers: customers,
  });
};

export default function CustomersIndex() {
  const { customers } = useLoaderData<typeof loader>();
  let [searchParams] = useSearchParams();
  let [sortProp, desc] = searchParams.get("sort")?.split(":") ?? [];
  let sortedData = [...customers].sort((a, b) => {
    return desc
      ? b[sortProp]?.localeCompare(a[sortProp])
      : a[sortProp]?.localeCompare(b[sortProp]);
  });

  const schemaShape = objectFromSchema(CustomerModel).shape;

  return (
    <IndexContainer>
      <Header>
        <Header.TitleSection>
          <Header.Title>Customers</Header.Title>
          <Header.Subtitle>
            A list of all the users in your account including their name, title,
            email and role.
          </Header.Subtitle>
        </Header.TitleSection>
        <AddButton to="./new">Add user</AddButton>
      </Header>
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-500">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {Object.keys(schemaShape).map((key, value) => (
                      <SortableColumn key={key} prop={key}>
                        <p className={"capitalize"}>{key}</p>
                      </SortableColumn>
                    ))}
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-500 dark:bg-gray-800">
                  {sortedData.map((item) => (
                    <tr key={item.email}>
                      {Object.keys(schemaShape).map((key, value) => (
                        <td
                          key={key}
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 first:pl-4 first:pr-3 first:font-medium dark:text-gray-200 first:sm:pl-6"
                        >
                          {item[key]}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <Link
                          to={`./${item.id}`}
                          className="text-blue-500 hover:text-blue-400"
                        >
                          Edit
                          <span className={"sr-only"}> {item.name}</span>
                        </Link>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <RemoveButton id={item.id} variant={"full"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </IndexContainer>
  );
}
