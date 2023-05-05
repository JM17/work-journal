import * as React from "react";
import clsx from "clsx";

const Checkbox = React.forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements["input"]
>(({ type = "checkbox", className, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={clsx(
      "h-4 w-4 rounded",
      className,
      !className && "border-gray-300 text-blue-600 focus:ring-blue-500"
    )}
    {...props}
  />
));

Checkbox.displayName = "Checkbox";
export default Checkbox;
