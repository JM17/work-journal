import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  leading?: ReactNode;
  onClick?: () => void;
};

export default function Button({
  children,
  className,
  disabled,
  leading,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="submit"
      className={`inline-flex items-center rounded bg-blue-500 px-2.5 py-1.5 text-xs text-white  hover:bg-blue-400 ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {leading && <span className="mr-0.5 -ml-0.5 h-5 w-5">{leading}</span>}
      {children}
    </button>
  );
}
