import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("dashboard/orders/");
        setOrders(res.data || []);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <h1 className="text-2xl font-bold mb-2">My Orders</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven’t placed any orders yet.</p>
          <Link
            to="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-semibold text-lg">
                    Order #{order.id}
                  </p>

                  <p className="text-sm text-gray-500">
                    Placed on {formatDate(order.created_at)}
                  </p>

                  <p className="text-sm text-gray-700">
                    {order.items.length} item(s)
                  </p>

                  <p className="font-medium text-gray-900">
                    Total: ₹{order.total_price}
                  </p>

                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${statusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderPage;
