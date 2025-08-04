import { useState } from 'react';

export type TabType = 'orders' | 'inbox';

export function useTab(defaultTab: TabType = 'orders') {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    switchTab,
  };
}