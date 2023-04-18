import { faker } from "@faker-js/faker";
import { Link, useSearchParams } from "@remix-run/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import NavButton, { BackIcon } from "~/components/buttons/nav-button";
import type { ReactNode } from "react";

faker.seed(123);

let people = faker.datatype.array(20).map(() => {
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  let name = `${firstName} ${lastName}`;
  let email = faker.internet.email(firstName, lastName).toLowerCase();

  return {
    name,
    title: faker.name.jobTitle(),
    email,
    role: faker.name.jobType(),
  };
});

export default function Index() {
  let [searchParams] = useSearchParams();
  let [sortProp, desc] = searchParams.get("sort")?.split(":") ?? [];
  let sortedPeople = [...people].sort((a, b) => {
    return desc
      ? b[sortProp]?.localeCompare(a[sortProp])
      : a[sortProp]?.localeCompare(b[sortProp]);
  });

  return (
    <div className="mx-auto max-w-6xl py-8 lg:py-16 ">
      <div className={"pl-3"}>
        <NavButton to={`/`} label={"Home"} leftIcon={<BackIcon />} />
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Users
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
              A list of all the users in your account including their name,
              title, email and role.
            </p>
          </div>
          <button className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-400">
            Add user
          </button>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-500">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <SortableColumn prop="name">Name</SortableColumn>
                      <SortableColumn prop="title">Title</SortableColumn>
                      <SortableColumn prop="email">Email</SortableColumn>
                      <SortableColumn prop="role">Role</SortableColumn>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Edit</span>
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Delete</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-500 dark:bg-gray-800">
                    {sortedPeople.map((person) => (
                      <tr key={person.email}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                          {person.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-200">
                          {person.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-200">
                          {person.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-200">
                          {person.role}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                          <Link
                            to={`/users/${person.name}`}
                            className="text-blue-500 hover:text-blue-400"
                          >
                            Edit
                            <span className={"sr-only"}> {person.name}</span>
                          </Link>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                          <Link
                            to={`/users/${person.name}`}
                            className="text-red-500 hover:text-red-400"
                          >
                            Delete
                            <span className={"sr-only"}> {person.name}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortableColumn({
  prop,
  children,
}: {
  prop: string;
  children: ReactNode;
}) {
  let [searchParams] = useSearchParams();
  let [sortProp, desc] = searchParams.get("sort")?.split(":") ?? [];
  let newSort = null;

  if (sortProp !== prop) {
    newSort = prop;
  } else if (sortProp === prop && !desc) {
    newSort = `${prop}:desc`;
  }

  let newSearchParams = new URLSearchParams({ sort: newSort as string });

  return (
    <th
      scope="col"
      className="py-3.5 px-3 text-left text-sm text-gray-900 first:pl-4 dark:text-white first:sm:pl-6"
    >
      <Link
        to={newSort ? `/users/?${newSearchParams}` : "/users"}
        className="group inline-flex font-semibold"
      >
        {children}
        <span
          className={`${
            sortProp === prop
              ? "bg-gray-200 text-gray-900 group-hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:group-hover:bg-gray-600"
              : "invisible text-gray-400 group-hover:visible dark:text-gray-200"
          } ml-2 flex-none rounded`}
        >
          <ChevronDownIcon
            className={`${desc ? "rotate-180" : ""} h-5 w-5`}
            aria-hidden="true"
          />
        </span>
      </Link>
    </th>
  );
}
