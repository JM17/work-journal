import type { ReactNode } from "react";
import { Link, useSearchParams } from "@remix-run/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export function SortableColumn({
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
