import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // MUST match backend statuses
  const steps = ["Pending", "Processing", "Shipped", "Delivered"];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}/`);
        setOrder(res.data);
        console.log(res.data);
      } catch {
        setError("Order not found");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const progress =
    order && steps.includes(order.status)
      ? (steps.indexOf(order.status) / (steps.length - 1)) * 100
      : 0;

  if (loading) {
    return <p className="p-6 text-center">Loading order...</p>;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate("/orders")}
          className="text-blue-600 underline"
        >
          Back to orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Orders
      </button>

      {/* Order Summary */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-bold text-xl mb-1">Order #{order.id}</h2>

        <p className="text-gray-600 mb-2">Total: ₹{order.total_price}</p>

        <span
          className={`inline-block px-3 py-1 rounded-full text-sm ${
            order.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "Cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Progress Bar */}
      {order.status !== "Cancelled" && (
        <div className="mb-6">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-600 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            {steps.map((s) => (
              <span
                key={s}
                className={
                  steps.indexOf(order.status) >= steps.indexOf(s)
                    ? "text-blue-600 font-medium"
                    : "text-gray-400"
                }
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-4">Items</h3>

        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between py-2 border-b last:border-b-0"
          >
            <div>
              <p className="font-medium">{item.product_title || "Product"}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">
              ₹{item.price_at_purchase * item.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {(order.status === "Pending" || order.status === "Processing") && (
          <button className="flex-1 bg-red-500 text-white py-2 rounded">
            Cancel Order
          </button>
        )}

        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-500 text-white py-2 rounded"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
}

export default OrderDetails;
