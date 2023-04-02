import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";
import LogoutButton from "~/components/buttons/logout-button";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  if (!user?.username || typeof user.id !== "string") {
    throw redirect(`/login`);
  }
  return json({
    user,
  });
};

export default function EntriesRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-7xl p-10">
      {user?.username && (
        <div className={"mb-4 flex align-middle"}>
          <h3 className={"flex-grow"}>
            Welcome, <b>{user?.username}</b>
          </h3>
          <LogoutButton />
        </div>
      )}
      <h1 className="text-5xl">Work Journal</h1>
      <p className="mt-2 mb-6 text-lg text-gray-400">
        Learnings and doings. Updated weekly.
      </p>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
