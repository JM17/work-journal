import { Form } from "@remix-run/react";
import React, { useRef } from "react";
import clsx from "clsx";

export default function RemoveButton({
  id,
  variant,
}: {
  id: string;
  variant?: "icon" | "full";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <div>
      <button onClick={() => dialogRef.current?.showModal()}>
        {variant === "full" ? (
          <span className="text-red-500 hover:text-red-400">Delete</span>
        ) : (
          <>&times;</>
        )}
      </button>
      <dialog id="dialog" ref={dialogRef}>
        <div className="fixed inset-0 z-20 bg-black/50" />
        <div
          className={clsx(
            "fixed z-50",
            "w-[95vw] max-w-md rounded-lg p-4 md:w-full",
            "left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]",
            "whitespace-normal bg-white text-left dark:bg-gray-800"
          )}
        >
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Are you sure?
          </h2>
          <p className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
            This action cannot be undone. This will permanently delete your
            entry.
          </p>
          <div className={"mt-4 flex justify-end space-x-2"}>
            <form method={"dialog"}>
              <button
                className={clsx(
                  "inline-flex select-none justify-center rounded-md px-2 py-1 text-sm font-medium",
                  "bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 hover:dark:bg-gray-600",
                  "border border-gray-300 dark:border-transparent",
                  "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                )}
              >
                Close
              </button>
            </form>

            <Form method="delete">
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="id" value={id} />

              <button
                type="submit"
                className={clsx(
                  "inline-flex select-none justify-center rounded-md px-2 py-1 text-sm font-medium",
                  "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:text-gray-100 dark:hover:bg-red-600",
                  "border border-transparent",
                  "focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75"
                )}
              >
                Yes, delete entry
              </button>
            </Form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
