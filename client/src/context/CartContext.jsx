/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../api/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }

    setCartLoading(true);

    try {
      const response = await getCart();
      setCart(response.data);
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    const response = await addCartItem(productId, quantity);
    setCart(response.data);
  }, []);

  const updateItem = useCallback(async (productId, quantity) => {
    const response = await updateCartItem(productId, quantity);
    setCart(response.data);
  }, []);

  const removeItem = useCallback(async (productId) => {
    const response = await removeCartItem(productId);
    setCart(response.data);
  }, []);

  const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cart.items.reduce((total, item) => {
    const product = item.product;
    const price = product?.discountPrice ?? product?.price ?? 0;

    return total + price * item.quantity;
  }, 0);

  const value = useMemo(
    () => ({
      addItem,
      cart,
      cartLoading,
      itemCount,
      loadCart,
      removeItem,
      subtotal,
      updateItem,
    }),
    [
      addItem,
      cart,
      cartLoading,
      itemCount,
      loadCart,
      removeItem,
      subtotal,
      updateItem,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useCart = () => useContext(CartContext);

export { CartProvider, useCart };
