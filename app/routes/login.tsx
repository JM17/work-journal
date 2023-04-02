import { useActionData, useSearchParams } from "@remix-run/react";
import { ActionArgs } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { badRequest } from "~/utils/request.server";
import { createUserSession, login, register } from "~/utils/session.server";

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
    <div className="p=6 mx-auto max-w-3xl">
      <div className="my-8 rounded-xl border border-gray-700 p-8 text-center">
        <h1 className="text-5xl">
          <span className="font-extralight">Welcome to</span> Work Journal
        </h1>
        <p className="mt-2 border-b-gray-700 text-lg text-gray-400">
          Learnings and doings. Updated weekly.
        </p>

        <form method="post" className="mt-8 space-y-2">
          <input
            type="hidden"
            name="redirectTo"
            defaultValue={"/"}
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <fieldset className={"space-x-4"}>
            <label>
              <input
                className="mr-1"
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
                className="mr-1"
                type={"radio"}
                name={"loginType"}
                value={"register"}
                defaultChecked={actionData?.fields?.loginType === "register"}
              />
              Register
            </label>
          </fieldset>
          <div>
            <input
              className="w-full max-w-md rounded p-2 text-gray-700"
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
              className="w-full max-w-md rounded p-2 text-gray-700"
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
          <div>
            <button
              className="mt-4 mb-2 w-full max-w-md rounded-md bg-blue-500 px-4 py-1 font-semibold text-white hover:bg-blue-400"
              type={"submit"}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
