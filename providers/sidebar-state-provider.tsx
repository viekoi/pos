"use client";

import { createContext, useContext, useState } from "react";

interface SidebarStateContextProps {
  children: React.ReactNode;
}

type SidebarStateContextType = {
  isExpand: boolean;
  setExpand: (value?:boolean) => void;
};

export const SidebarStateContext = createContext<SidebarStateContextType>({
  isExpand: false,
  setExpand: (value?:boolean) => {},
});

export const SidebarStateProvider: React.FC<SidebarStateContextProps> = ({
  children,
}) => {
  const [isExpand, setExpand] = useState(false);

  const handleSetExpand = (value?: boolean) => {
    setExpand(value ? value : !isExpand);
  };

  return (
    <SidebarStateContext.Provider
      value={{ isExpand, setExpand: handleSetExpand }}
    >
      {children}
    </SidebarStateContext.Provider>
  );
};

export const useSidebarState = () => {
  const context = useContext(SidebarStateContext);
  if (!context) {
    throw new Error("useSidebarState must be used within the provider");
  }
  return context;
};

export default useSidebarState;
