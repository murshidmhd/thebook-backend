import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../features/context/CartContext";
import toast from "react-hot-toast";

export default function Cart() {
  const {
    cartItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
    error,
    loading,
  } = useCart();

  const navigate = useNavigate();

  const handleUpdateQuantity = useCallback(
    (id, qty) => {
      if (qty < 1) return;
      updateQuantity(id, qty);
    },
    [updateQuantity]
  );

  const handleRemove = useCallback(
    (item) => {
      removeFromCart(item);
      toast.success(`Removed "${item.product.title || item.name}"`);
    },
    [removeFromCart]
  );

  const handleClear = useCallback(() => {
    if (window.confirm("Clear entire cart?")) {
      clearCart();
      toast.success("Cart cleared");
    }
  }, [clearCart]);

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) return;
    toast.success("Redirecting...");
    navigate("/orderdetails");
  }, [cartItems.length, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-8xl opacity-20 mb-4">🛒</div>
        <h3 className="text-3xl font-bold mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-6">
          Browse items and add them to your cart.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const shipping = totalPrice > 500 ? 0 : 50;
  const total = totalPrice + shipping;

  return (
    <div className="min-h-screen p-6 bg-gray-100 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-6 mb-8">
        {cartItems.map((item) => (
          <div
            key={item.product.id}
            className="bg-white p-4 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product.image_url}
                alt={item.product.title || item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">
                  {item.product.title || item.name}
                </h3>
                {/* <p className="text-gray-600">
                  ₹{item.product.price.toFixed(2)} each
                </p> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleUpdateQuantity(item.product.id, item.quantity - 1)
                }
                className="px-2 bg-gray-200 rounded"
              >
                –
              </button>
              <span className="px-3">{item.quantity}</span>
              <button
                onClick={() =>
                  handleUpdateQuantity(item.product.id, item.quantity + 1)
                }
                className="px-2 bg-gray-200 rounded"
              >
                +
              </button>
              <button
                onClick={() => handleRemove(item.product.id)}
                className="ml-4 text-red-500"
              >
                Remove
              </button>
            </div>
            <div className="font-semibold">
              {/* {console.log(item.product.price)} */}
              ₹{(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items ({itemCount})</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
        </div>
        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={cartItems.length === 0}
        >
          Place Order
        </button>
        <button
          onClick={handleClear}
          className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
