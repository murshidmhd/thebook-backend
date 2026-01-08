import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import api from "../../services/api";

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();

  const { address, subtotal } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address || !subtotal) {
      toast.error("Session expired");
      navigate("/orderdetails");
    }
  }, [address, subtotal, navigate]);

  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const PAYMENT_METHODS = {
    ONLINE: "online",
    COD: "cod",
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    const payload = {
      address_id: address.id,
      items: cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      // 🔹 CASH ON DELIVERY
      if (paymentMethod === PAYMENT_METHODS.COD) {
        await api.post("/orders/create/", payload);

        clearCart();
        toast.success("Order placed successfully (Cash on Delivery)");
        navigate("/orders");
        return;
      }

      if (paymentMethod === PAYMENT_METHODS.ONLINE) {
        console.log("after selecting method")


        const orderRes = await api.post("/orders/online_pay/", payload);
        console.log(orderRes)
        console.log("after order")


        const orderId = orderRes.data.order_id;

        const razorpayRes = await api.post("/payments/razorpay/create/", {
          order_id: orderId,
        });

        console.log("after razorpay api")


        const options = {
          key: razorpayRes.data.razorpay_key,
          amount: razorpayRes.data.amount,
          currency: "INR",
          order_id: razorpayRes.data.razorpay_order_id,
          name: "Your Store Name",
          description: "Order Payment",
          

          handler: async function (response) {
            try {
              await api.post("/payments/razorpay/verify/", {
                order_id: orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              clearCart();
              toast.success("Payment successful!");
              navigate("/orders");
            } catch (err) {
              console.error(err);
              toast.error("Payment verification failed");
            }
          },

          modal: {
            ondismiss: function () {
              toast.error("Payment cancelled");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!address) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Finalize Payment</h1>

      {/* Order Summary */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹{shipping}</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2 mt-2">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <p className="font-medium">{address.street}</p>
        <p>
          {address.city}, {address.state} - {address.pincode}
        </p>
        <p>Phone: {address.phone}</p>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-4 rounded shadow mb-6">
        {[
          { label: "Online Payment", value: PAYMENT_METHODS.ONLINE },
          { label: "Cash on Delivery", value: PAYMENT_METHODS.COD },
        ].map((method) => (
          <label key={method.value} className="flex gap-2 items-center">
            <input
              type="radio"
              value={method.value}
              checked={paymentMethod === method.value}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {method.label}
          </label>
        ))}
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded"
      >
        {loading ? "Processing..." : `Pay ₹${total}`}
      </button>
    </div>
  );
}

export default PaymentPage;
