import { json, LoaderArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";
import BackButton from "~/components/back-button";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  if (!user?.username || typeof user.id !== "string") {
    throw redirect(`/login`);
  }
  return json({
    user,
  });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-7xl p-10">
      {user?.username && (
        <div className={"mb-4 flex align-middle"}>
          <h3 className={"flex-grow"}>
            Welcome, <b>{user?.username}</b>
          </h3>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="inline-flex items-center  text-gray-400 hover:text-gray-300"
            >
              Logout
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ml-1 h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
      <h1 className="text-5xl">Work Journal</h1>
      <p className="mt-2 text-lg text-gray-400">
        Learnings and doings. Updated weekly.
      </p>
      <main>
        <BackButton to={"entries"} label={"Journal"} />
      </main>
    </div>
  );
}
