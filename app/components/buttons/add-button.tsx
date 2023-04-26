import { Link } from "@remix-run/react";
import type { ReactNode } from "react";
import Button from "~/components/buttons/button";
import { PlusIcon } from "@heroicons/react/20/solid";

export default function AddButton({
  children,
  to,
}: {
  children: ReactNode;
  to: string;
}) {
  return (
    <Link to={to}>
      <Button leading={<PlusIcon />}>{children}</Button>
    </Link>
  );
}
