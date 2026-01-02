import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api from "../../services/api"; // Your configured axios instance
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Django returns an object: { items: [...], total_price: 123 }
      setCartItems(res.data.items || []);
      setTotalPrice(res.data.total_price || 0);
      setError(null);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Could not load cart items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product) => {
    const token = localStorage.getItem("access");
    if (!token) {
      toast.error("Please login first!");
      return;
    }

    try {
      await api.post(
        "/cart/",
        { product_id: product.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Added to cart!");
      await fetchCart();
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("🛒 Item already in cart!");
      } else {
        toast.error("❌ Failed to add item.");
      }
    }
  };

  const removeFromCart = async (productOrId) => {
    const token = localStorage.getItem("access");
    const productId = productOrId.id || productOrId;

    try {
      await api.delete("/cart/", {
        headers: { Authorization: `Bearer ${token}` },
        data: { product_id: productId },
      });
      toast.error("Removed from cart 🗑️");
      await fetchCart();
    } catch (err) {
      toast.error("Could not remove item.");
      console.log(err)

    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;

    const token = localStorage.getItem("access");
    try {
      await api.put(
        "/cart/",
        { product_id: productId, quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) {
      toast.error("Quantity update failed.");
      console.log(err)
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    setTotalPrice(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
        error,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);


