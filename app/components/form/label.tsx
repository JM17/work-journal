import clsx from "clsx";

export default function Label({
  className,
  ...props
}: JSX.IntrinsicElements["label"]) {
  return (
    <label
      className={clsx(
        "block text-sm font-medium",
        className,
        !className && "text-gray-600 dark:text-gray-400"
      )}
      {...props}
    />
  );
}
