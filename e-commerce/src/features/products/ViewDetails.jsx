import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define status steps (excluding Cancelled for progress bar)
  const steps = ["Pending", "Shipped", "Out for Delivery", "Delivered"];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const userId = localStorage.getItem("userId");
        // if (!userId) return navigate("/login");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${userId}`
        );
        const found = res.data.order?.find((o) => String(o.id) === String(id));
        if (!found) return navigate("/orders");
        setOrder(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  // Progress %
  const progress = order
    ? (steps.indexOf(order.status) / (steps.length - 1)) * 100
    : 0;

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!order) return <p className="p-6 text-center">Order not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate("/orders")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-bold text-xl mb-2">{order.name}</h2>
        <p className="text-gray-600">₹{order.price}</p>
        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
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

      {/* Progress */}
      {order.status !== "Cancelled" && (
        <div className="mb-6">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-600 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            {steps.map((s) => (
              <span
                key={s}
                className={
                  steps.indexOf(order.status) >= steps.indexOf(s)
                    ? "text-blue-600 font-medium"
                    : ""
                }
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {order.status === "Pending" || order.status === "Shipped" ? (
          <button className="flex-1 bg-red-500 text-white py-2 rounded">
            Cancel Order
          </button>
        ) : null}
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

export default ViewDetails;
