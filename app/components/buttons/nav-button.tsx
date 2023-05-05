import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

type NavButtonProps = {
  label?: string;
  leftIcon?: React.ReactNode;
};

export default function NavButton({
  to,
  label,
  leftIcon,
}: LinkProps & NavButtonProps) {
  return (
    <nav>
      <Link
        to={to}
        className={
          "inline-flex items-center text-sm text-blue-500 hover:text-blue-400"
        }
      >
        {leftIcon}
        {label || "Back"}
      </Link>
    </nav>
  );
}
