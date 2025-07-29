// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const isUser = user?.role === "user";

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (service) => {
    if (!isUser) return;
    if (!cart.find((item) => item._id === service._id)) {
      setCart([...cart, service]);
      toast.success(`${service.title} added to cart`);
    }
  };

  const removeFromCart = (id) => {
    if (!isUser) return;
    setCart(cart.filter((item) => item._id !== id));
    toast.success("Service removed from cart");
  };

  const clearCart = () => {
    setCart([]);
    toast("Cart cleared");
  };

  return (
    <CartContext.Provider
      value={{
        cart: isUser ? cart : [],
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
