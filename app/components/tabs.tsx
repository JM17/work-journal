import { useState } from "react";
import { Link, useLocation } from "@remix-run/react";
import { motion } from "framer-motion";

type Tab = {
  to: string;
  label: string;
};

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  let location = useLocation();
  let [activeTab, setActiveTab] = useState(location.pathname || "/");

  return (
    <div className="flex space-x-1">
      {tabs.map((tab) => (
        <Link to={tab.to} key={tab.to}>
          <button
            onClick={() => setActiveTab(tab.to)}
            className={`${
              activeTab === tab.to ? "" : "hover:opacity-50"
            } relative rounded-full px-3 py-1.5 text-sm font-medium text-gray-900 outline-2 outline-sky-400 focus-visible:outline dark:text-white`}
          >
            {activeTab === tab.to && (
              <motion.div
                /** This is required for framer motion to apply layout animation */
                layoutId="active-tab"
                className="absolute inset-0 bg-blue-500"
                /** This is required for framer motion to know precise rounded value for animation, as it cannot read it directly from Tailwind class  */
                style={{ borderRadius: 9999 }}
                transition={{ type: "spring", duration: 0.6 }}
              />
            )}
            {/** This is required in order for a non black/white background to generate a contrast text color with mix-blend-exclusion */}
            <div className="grayscale">
              <span className={"relative z-10 mix-blend-exclusion"}>
                {tab.label}
              </span>
            </div>
          </button>
        </Link>
      ))}
    </div>
  );
}
