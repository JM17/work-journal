import * as React from "react";
import clsx from "clsx";

const Radio = React.forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements["input"]
>(({ type = "radio", className, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={clsx(
      "h-4 w-4 rounded-full",
      className,
      !className && "border-gray-300 text-blue-600 focus:ring-blue-500"
    )}
    {...props}
  />
));

Radio.displayName = "Radio";
export default Radio;
