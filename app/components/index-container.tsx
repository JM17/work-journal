import type { PropsWithChildren } from "react";

export default function IndexContainer({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto max-w-7xl py-4 lg:py-8  ">
      <div className="px-2 sm:px-4 lg:px-6">{children}</div>
    </div>
  );
}
