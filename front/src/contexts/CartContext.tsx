import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import { getCart } from '../services/api/cart';
import { CartItem } from '@shared/schemas/cart';
import { useUser } from './UserContext';

interface CartContextType {
  cartItems: CartItem[];
  totalQuantity: number;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartContextProviderProps {
  children: ReactNode;
}

export const CartContextProvider: React.FC<CartContextProviderProps> = ({
  children,
}) => {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getCart();
      setCartItems(response.items);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初回マウント時とログイン状態が変わった時にカートを取得
  useEffect(() => {
    refreshCart();
  }, [user.id, refreshCart]);

  // ページフォーカス時にカートを再取得（別タブで更新された場合の同期）
  useEffect(() => {
    const handleFocus = () => {
      refreshCart();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshCart]);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.amount, 0);

  const value = useMemo(
    () => ({ cartItems, totalQuantity, refreshCart, isLoading }),
    [cartItems, totalQuantity, refreshCart, isLoading],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartContextProvider');
  }
  return context;
};
