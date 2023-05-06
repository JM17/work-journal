import type { PropsWithChildren } from "react";

export default function FormContainer({ children }: PropsWithChildren) {
  return (
    <div className="max-w-xl rounded-xl border-[1px] border-gray-200 bg-white/30 p-6 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/30">
      {children}
    </div>
  );
}
