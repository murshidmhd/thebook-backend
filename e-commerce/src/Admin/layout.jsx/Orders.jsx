import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/dashboard/orders/");
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch("/dashboard/orders/", {
        order_id: orderId,
        status: status,
      });
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-xl shadow border border-gray-200"
        >
          {/* ORDER HEADER */}
          <div className="flex justify-between items-center p-4 border-b bg-gray-50">
            <div>
              <p className="font-semibold text-gray-800">
                Order #{order.id}
              </p>
              <p className="text-sm text-gray-500">
                User ID: {order.user} •{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <select
              value={order.status}
              onChange={(e) => updateStatus(order.id, e.target.value)}
              className="border rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          {/* ORDER ITEMS */}
          <div className="p-4">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-2">Product ID</th>
                  <th className="text-left p-2">Quantity</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">{item.product}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">
                      ₹{item.price_at_purchase}
                    </td>
                    <td className="p-2 font-medium">
                      ₹
                      {(
                        Number(item.price_at_purchase) *
                        Number(item.quantity)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ORDER FOOTER */}
          <div className="flex justify-end p-4 border-t bg-gray-50">
            <p className="text-lg font-bold text-gray-800">
              Total: ₹{order.total_price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersPage;
