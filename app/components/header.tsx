import type { ReactNode } from "react";

function Header({ children }: { children: ReactNode }) {
  return <div className="sm:flex sm:items-center">{children}</div>;
}

function TitleSection({ children }: { children: ReactNode }) {
  return <div className="sm:flex-auto">{children}</div>;
}

Header.TitleSection = TitleSection;

function Title({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
      {children}
    </h1>
  );
}

Header.Title = Title;

function Subtitle({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 mb-2 text-sm text-gray-700 dark:text-gray-400">
      {children}
    </p>
  );
}

Header.Subtitle = Subtitle;

export default Header;
