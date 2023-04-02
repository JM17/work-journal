import { Form } from "@remix-run/react";

export default function RemoveButton({ id }: { id: string }) {
  return (
    <Form method="post">
      <input type="hidden" name="intent" value="remove" />
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center  text-gray-400 hover:text-gray-300"
      >
        &times;
      </button>
    </Form>
  );
}
