export default function SubmitButton({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  return (
    <button
      type="submit"
      className="rounded bg-blue-500 px-6 py-1 font-semibold text-white hover:bg-blue-400"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Saving..." : "Save"}
    </button>
  );
}
