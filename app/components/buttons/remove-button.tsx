import { Form } from "@remix-run/react";
import React, { useState } from "react";
import clsx from "clsx";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import Button from "~/components/buttons/button";
import { TrashIcon } from "@heroicons/react/20/solid";

export default function RemoveButton({
  id,
  variant,
}: {
  id: string;
  variant?: "icon" | "full";
}) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild className={"data-[state=open]:opacity-50"}>
        <Button
          className={
            variant === "full"
              ? "bg-red-500 hover:bg-red-400"
              : "bg-transparent hover:bg-red-500"
          }
          leading={variant === "full" && <TrashIcon />}
        >
          {variant === "full" ? <>Delete</> : <>&times;</>}
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal className="transition-all">
        <AlertDialog.Overlay className="fixed inset-0 z-20 bg-black/50" />
        <AlertDialog.Content
          className={clsx(
            "fixed z-50",
            "w-[95vw] max-w-md rounded-lg p-4 md:w-full",
            "left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]",
            "whitespace-normal bg-white text-left dark:bg-gray-800"
          )}
        >
          <AlertDialog.Title className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Are you sure?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
            This action cannot be undone. This will permanently delete your
            entry.
          </AlertDialog.Description>
          <div className={"mt-4 flex justify-end space-x-2"}>
            <AlertDialog.Cancel asChild>
              <button
                className={clsx(
                  "inline-flex select-none justify-center rounded-md px-2 py-1 text-sm font-medium",
                  "bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 hover:dark:bg-gray-600",
                  "border border-gray-300 dark:border-transparent",
                  "focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                )}
              >
                Close
              </button>
            </AlertDialog.Cancel>

            <Form method="delete">
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="id" value={id} />
              <button
                className={clsx(
                  "inline-flex select-none justify-center rounded-md px-2 py-1 text-sm font-medium",
                  "bg-red-500 text-white hover:bg-red-400 dark:bg-red-500 dark:text-gray-100 dark:hover:bg-red-400",
                  "border border-transparent",
                  "focus:outline-none focus-visible:ring focus-visible:ring-red-400 focus-visible:ring-opacity-75"
                )}
              >
                Yes, delete entry
              </button>
            </Form>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
