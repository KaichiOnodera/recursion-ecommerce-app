import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

export interface UserInfo {
  id: number | null;
  role: 'USER' | 'ADMIN' | null;
}

interface UserContextType {
  user: UserInfo;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
  isLoggedIn: () => boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [user, setUserState] = useState<UserInfo>({
    id: null,
    role: null,
  });

  const setUser = useCallback((userInfo: UserInfo) => {
    setUserState(userInfo);
  }, []);

  const clearUser = useCallback(() => {
    setUserState({ id: null, role: null });
  }, []);

  const isLoggedIn = useCallback((): boolean => {
    return user.id !== null && user.role !== null;
  }, [user]);

  const isAdmin = useCallback((): boolean => {
    return user.role === 'ADMIN';
  }, [user]);

  const isUser = useCallback((): boolean => {
    return user.role === 'USER';
  }, [user]);

  const value: UserContextType = useMemo(
    () => ({
      user,
      setUser,
      clearUser,
      isLoggedIn,
      isAdmin,
      isUser,
    }),
    [user, setUser, clearUser, isLoggedIn, isAdmin, isUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};
