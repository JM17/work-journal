import { createFormAction } from "remix-forms";
import { json, redirect } from "@remix-run/node";

const formAction = createFormAction({ redirect, json });

export { formAction };
