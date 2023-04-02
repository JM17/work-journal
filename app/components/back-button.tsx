import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

type BackButtonProps = {
  label?: string;
};

export default function BackButton({ to, label }: LinkProps & BackButtonProps) {
  return (
    <nav>
      <Link
        to={to}
        className={"inline-flex items-center text-blue-500 hover:text-blue-400"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="mr-1 h-4 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        {label || "Back"}
      </Link>
    </nav>
  );
}
