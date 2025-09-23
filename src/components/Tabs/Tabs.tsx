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
    <div className="flex border-b border-gray-300">
      {tabs.map((tab, i) => (
        <button
          key={tab.value}
          onClick={() => handleClick(tab.value)}
          className={`px-4 py-2 text-sm font-medium ${
            activeIndex === i
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
