import { ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";

export default function LogoutButton() {
  return (
    <form action="/logout" method="post">
      <button
        type="submit"
        className="inline-flex items-center text-sm  text-gray-700 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
      >
        Logout
        <ArrowRightOnRectangleIcon className={"ml-1 h-5 w-5"} />
      </button>
    </form>
  );
}
