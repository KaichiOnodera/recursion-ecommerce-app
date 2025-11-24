import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from 'react';
import { getMe } from '../services/api/auth';

export interface UserInfo {
  id: number | null;
  lastName: string | null;
  firstName: string | null;
  email: string | null;
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
    lastName: null,
    firstName: null,
    email: null,
    role: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        if (response.user) {
          setUserState({
            id: response.user.id,
            lastName: response.user.lastName,
            firstName: response.user.firstName,
            email: response.user.email,
            role: response.user.role,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const setUser = useCallback((userInfo: UserInfo) => {
    setUserState(userInfo);
  }, []);

  const clearUser = useCallback(() => {
    setUserState({
      id: null,
      lastName: null,
      firstName: null,
      email: null,
      role: null,
    });
  }, []);

  const isLoggedIn = useCallback((): boolean => {
    return (
      user.id !== null &&
      user.lastName !== null &&
      user.firstName !== null &&
      user.email !== null &&
      user.role !== null
    );
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
