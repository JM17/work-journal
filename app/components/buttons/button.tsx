import type { ComponentProps, ReactNode } from "react";
import { forwardRef } from "react";

type ButtonProps = {
  /** Optional leading element, intended to use icon */
  leading?: ReactNode;
};

export default forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & ButtonProps
>(function Button(
  { children, className, disabled, leading, onClick, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center rounded bg-blue-500 px-2.5 py-1.5 text-xs text-white  hover:bg-blue-400 ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {leading && <span className="mr-0.5 -ml-0.5 h-5 w-5">{leading}</span>}
      {children}
    </button>
  );
});
