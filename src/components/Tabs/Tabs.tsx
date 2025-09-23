import { useState } from "react";

interface TabsProps<T> {
  tabs: { label: string; value: T }[];
  defaultTab?: T;
  onChange?: (value: T) => void;
}

export const Tabs = <T extends string | number>({
  tabs,
  defaultTab,
  onChange,
}: TabsProps<T>) => {
  const [activeIndex, setActiveIndex] = useState(defaultTab);

  const handleClick = (tab: T) => {
    setActiveIndex(tab);
    onChange?.(tab);
  };

  return (
    <div className="flex gap-2 border-b border-gray-700">
      {tabs.map((tab) => {
        const isActive = tab.value === activeIndex;
        return (
          <button
            key={tab.value}
            onClick={() => handleClick(tab.value)}
            className={`
          px-4 py-2 rounded-t-lg font-medium transition-colors
          border-t-2 border-l-2 border-r-2 cursor-pointer
          ${
            isActive
              ? "border-gray-700 bg-bg-default text-white"
              : "border-transparent text-gray-400 hover:text-white"
          }
        `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
