"use client";

import { getAuthUserStoreStaff } from "@/lib/queries";
import { Staff } from "@/type";
import { createContext, useContext, useEffect, useState } from "react";

type AuthUserWithRoleContextType = {
  authUserWithRole: Staff | null;
  isLoading: boolean;
};

interface AuthUserWithRoleProvider {
  children: React.ReactNode;
  storeId: string;
}

const AuthUserWithRoleContext = createContext<AuthUserWithRoleContextType>({
  authUserWithRole: null,
  isLoading: false,
});

const AuthUserWithRoleProvider: React.FC<AuthUserWithRoleProvider> = ({
  children,
  storeId,
}) => {
  const [userWithRole, setUserWithRole] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCurrentAuthUser = async () => {
      setIsLoading(true);
      const user = await getAuthUserStoreStaff(storeId);
      if (user) {
        setUserWithRole(user);
      }
      setIsLoading(false);
    };

    getCurrentAuthUser();
  }, [storeId]);

  return (
    <AuthUserWithRoleContext.Provider
      value={{ authUserWithRole: userWithRole, isLoading }}
    >
      {children}
    </AuthUserWithRoleContext.Provider>
  );
};

export const useAuthUserWithRole = () => {
  const context = useContext(AuthUserWithRoleContext);
  if (!context) {
    throw new Error("useModal must be used within the modal provider");
  }
  return context;
};

export default AuthUserWithRoleProvider;
