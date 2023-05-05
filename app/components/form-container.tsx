import type { PropsWithChildren } from "react";

export default function FormContainer({ children }: PropsWithChildren) {
  return (
    <div className="max-w-xl rounded-xl border-[1px] border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      {children}
    </div>
  );
}
