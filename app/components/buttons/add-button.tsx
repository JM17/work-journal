import { Link } from "@remix-run/react";
import type { ReactNode } from "react";

export default function AddButton({
  children,
  to,
}: {
  children: ReactNode;
  to: string;
}) {
  return (
    <Link to={to}>
      <button className="w-24 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-400">
        {children}
      </button>
    </Link>
  );
}
