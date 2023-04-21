import type {
  LinksFunction,
  LoaderArgs,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import { getEnv } from "~/env.server";
import LogoutButton from "~/components/buttons/logout-button";
import { getUser } from "~/utils/session.server";
import Tabs from "~/components/tabs";

type LoaderData = {
  ENV: ReturnType<typeof getEnv>;
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);
  if (!user?.username || typeof user.id !== "string") {
    throw redirect(`/login`);
  }
  return json<LoaderData>({ ENV: getEnv(), user });
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Work journal",
  viewport: "width=device-width,initial-scale=1",
});

let tabs = [
  { to: "/", label: "Home" },
  { to: "entries", label: "Journal" },
  { to: "customers", label: "Customers" },
  { to: "graph", label: "Graph" },
];

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-200">
        <div className="mx-auto max-w-7xl p-10">
          {data?.user?.username && (
            <div className={"mb-4 flex align-middle"}>
              <h3 className={"flex-grow"}>
                Welcome, <b>{data?.user?.username}</b>
              </h3>
              <LogoutButton />
            </div>
          )}
          <h1 className="text-5xl">Work Journal</h1>
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-400">
            Learnings and doings. Updated weekly.
          </p>
          <main>
            <div className="mt-4 mb-4">
              <Tabs tabs={tabs} />
            </div>
            <Outlet />
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
          }}
        />
        <LiveReload />
      </body>
    </html>
  );
}
