import type { ReactNode } from "react";

export default function AddButton({ children }: { children: ReactNode }) {
  return (
    <button className="w-24 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-400">
      {children}
    </button>
  );
}
