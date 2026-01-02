import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  const { orderId, address, subtotal } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("UPI");

  useEffect(() => {
    if (!orderId || !address) {
      toast.error("Session expired or no address selected.");
      navigate("/orderdetails");
    }
  }, [orderId, address, navigate]);

  const shipping = subtotal > 500 ? 0 : 50;
  const total = (subtotal || 0) + shipping;

  const handlePlaceOrder = async () => {
    try {
      clearCart();
      toast.success("Payment Successful! Order Placed.");
      navigate("/orders");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  if (!address) return null;
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Finalize Payment</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border">
        <h2 className="text-lg font-semibold mb-4">
          Order Summary (Order #{orderId})
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total to Pay</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border">
        <h2 className="text-lg font-semibold mb-3">Delivering To</h2>
        <div className="text-gray-700">
          <p className="font-medium text-blue-600 capitalize mb-1">
            {address.address_type}
          </p>
          <p>{address.street}</p>
          <p>
            {address.city}, {address.state} - {address.pincode}
          </p>
          <p className="mt-1 text-sm">Contact: {address.phone}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border">
        <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>
        <div className="space-y-3">
          {["UPI", "Card", "Cash on Delivery"].map((method) => (
            <label
              key={method}
              className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <span className="font-medium">{method}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full py-4 bg-green-600 text-white rounded-lg font-bold text-lg shadow-md hover:bg-green-700 transition-colors"
      >
        Pay & Confirm Order - ₹{total}
      </button>
    </div>
  );
}

export default PaymentPage;
