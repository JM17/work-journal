import type { PropsWithChildren } from "react";

export default function FormContainer({ children }: PropsWithChildren) {
  return <div className="p=6 max-w-2xl">{children}</div>;
}
