import { useActionData, useSearchParams } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { badRequest } from "~/utils/request.server";
import { createUserSession, login, register } from "~/utils/session.server";
import type { CSSProperties } from "react";

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

export async function action({ request }: ActionArgs) {
  const db = new PrismaClient();

  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const { username, password, loginType } = values;

  if (
    typeof loginType !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    // throw new Error("Bad request");
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { username, password, loginType };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  switch (loginType) {
    case "login": {
      // login to get the user
      // if there's no user, return the fields and a formError
      // if there is a user, create their session and redirect to /
      const user = await login({ username, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `Invalid username or password`,
        });
      }
      return createUserSession({ userId: user.id, redirectTo: "/entries" });
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username },
      });
      if (userExists) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `User with username ${username} already exists`,
        });
      }
      // create the user
      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fieldErrors: null,
          fields,
          formError: `Error creating user`,
        });
      }
      // create their session and redirect to /jokes
      return createUserSession({ userId: user.id });
    }
    default: {
      return badRequest({
        fieldErrors: null,
        fields,
        formError: `Login type invalid`,
      });
    }
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  return (
    <div
      className="mx-auto flex aspect-[2/1] w-full max-w-lg flex-col items-center justify-center rounded-xl border border-transparent p-8 text-center
      [background:padding-box_var(--bg-color),border-box_var(--border-color)]
      dark:[background:padding-box_var(--bg-color-dark),border-box_var(--border-color)]"
      style={
        {
          "--light-gray": "240 240 240",
          "--dark-gray": "25 25 25",
          "--light-purple": "120 119 198", // from the example
          "--light-blue": "59 130 246",

          "--bg-color":
            "linear-gradient(rgb(var(--light-gray)), rgb(var(--light-gray)))",
          "--bg-color-dark":
            "linear-gradient(rgb(var(--dark-gray)), rgb(var(--dark-gray)))",
          "--border-color": `linear-gradient(145deg,
            rgb(var(--light-blue)) 0%,
            rgb(var(--light-blue) / 0.3) 33.33%,
            rgb(var(--light-blue) / 0.14) 66.67%,
            rgb(var(--light-blue) / 0.1) 100%)
          `,
        } as CSSProperties
      }
    >
      <h1 className="text-4xl">
        <span className="font-extralight">Welcome to</span> Daily notes
      </h1>
      <p className="mt-4 border-b-gray-700 text-lg text-gray-400">
        Learnings and doings. Updated weekly.
      </p>

      <form method="post" className="mt-2 w-5/6 space-y-5">
        <input
          type="hidden"
          name="redirectTo"
          defaultValue={"/"}
          value={searchParams.get("redirectTo") ?? undefined}
        />
        <fieldset className={"space-x-6"}>
          <label>
            <input
              className="mr-2"
              type={"radio"}
              name={"loginType"}
              value={"login"}
              defaultChecked={
                !actionData?.fields?.loginType ||
                actionData?.fields?.loginType === "login"
              }
            />
            Login
          </label>
          <label>
            <input
              className="mr-2"
              type={"radio"}
              name={"loginType"}
              value={"register"}
              defaultChecked={actionData?.fields?.loginType === "register"}
            />
            Register
          </label>
        </fieldset>
        <div>
          <div>
            <input
              className="w-full rounded-t-lg border-b-0 border-gray-300 p-2 text-gray-700 dark:border-gray-400"
              type={"text"}
              name={"username"}
              placeholder={"Username"}
              id={"username-input"}
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? "username-error" : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <input
              className="w-full rounded-b-lg border-gray-300 p-2 text-gray-700 dark:border-gray-400"
              type={"password"}
              name={"password"}
              id={"password-input"}
              placeholder={"Password"}
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
              aria-errormessage={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData.formError}
              </p>
            ) : null}
          </div>
        </div>
        <div>
          <button
            className="mt-4 mb-2 w-1/2 max-w-md rounded-full bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-400"
            type={"submit"}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
