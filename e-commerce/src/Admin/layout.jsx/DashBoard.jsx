import { useEffect, useState } from "react";
import api from "../../services/api";
import CircleChart from "../component/CircleChart";
import LineChartCompo from "../component/LineChart";

function DashBoard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [paidOrders, setPaidOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [lineChartData, setLineChartData] = useState();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      try {
        const res = await api.get("/dashboard/revenue/");
        setTotalRevenue(res.data.total_revenue);
        setTotalOrders(res.data.total_orders);
        setPaidOrders(res.data.paid_orders);
        setPendingOrders(res.data.pending_orders);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/dashboard/products/");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/dashboard/orders/");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  const chartData = products.reduce((acc, product) => {
    const type = product.type || "other";
    const found = acc.find((item) => item.name === type);

    if (found) {
      found.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }

    return acc;
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      const res = await api.get("/dashboard/revenue-chart/");
      setLineChartData(res.data);
    };

    fetchChartData();
  }, []);

  // lineChartData.sort((a, b) => new Date(a.date) - new Date(b.date));

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error loading dashboard</p>;

  return (
    <div className="p-6 space-y-8">
      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹ ${totalRevenue}`} />
        <StatCard title="Total Orders" value={totalOrders} />
        <StatCard title="Paid Orders" value={paidOrders} />
        <StatCard title="Pending Orders" value={pendingOrders} />
      </div>

      {/* CHARTS */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white p-4 rounded shadow">
          <CircleChart data={chartData} />
        </div>
        <div className="flex-1 bg-white p-4 rounded shadow">
          <LineChartCompo data={lineChartData} title="Revenue Over Time" />
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <ul className="space-y-2">
          {recentOrders.map((order) => (
            <li key={order.id} className="border-b pb-2">
              <p>
                <strong>{order.user.username}</strong> — ₹{order.total_price}
              </p>
              <p className="text-sm text-gray-500">
                {order.status} | {new Date(order.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow">
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

export default DashBoard;
