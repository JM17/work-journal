import * as React from "react";
import { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef<HTMLInputElement, JSX.IntrinsicElements["input"]>(
  ({ type = "text", className, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={clsx(
        "block w-full rounded-md text-gray-800 shadow-sm sm:text-sm",
        className,
        !className &&
          "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
export default Input;
