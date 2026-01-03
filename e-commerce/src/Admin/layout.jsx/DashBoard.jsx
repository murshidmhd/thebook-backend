import axios from "axios";
import { useEffect, useState } from "react";
import CircleChart from "../component/CircleChart";
import LineChartCompo from "../component/LineChart";
import api from "../../services/api";

function DashBoard() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [salesData, setSalesData] = useState(0);

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetcing = async () => {
      setLoading(true);
      try {
        console.log("API base URL:", import.meta.env.VITE_API_URL);

        const usersFetch = await api.get(`/dashboard/products/`);
        const listingsFetch = await api.get(`dashboard/users/`);
        setUsers(usersFetch.data);
        setListings(listingsFetch.data);

        setLoading(false);

        let totalorders = usersFetch.data
          .flatMap((u) => {
            return u.order || [];
          })

          .reduce((sum, order) => {
            let price = Number(order.price) || 0;
            let quantity = Number(order.quantity) || 0;

            sum = sum + price * quantity;

            return sum;
          }, 0);
        setSalesData(totalorders);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    };
    fetcing();
  }, []);

  const chartData = listings.reduce((acc, product) => {
    const type = product.type || "other";

    // if (!type) {
    //   return acc; product without type illath oyvaka
    // }

    const existing = acc.find((item) => item.name === type);

    if (!existing) {
      acc.push({ name: type, value: 1 });
    } else {
      existing.value += 1;
    }

    return acc;
  }, []);
  // console.log(chartData);

  // if (loading) {
  //   return <p>Loading data...</p>;
  // } else if (error) {
  //   return <p>An error occurred. Please try again later. {error}</p>;
  // }

  const userLength = users.length;
  const productLenth = listings.length;
  const totalRevenue = salesData;

  useEffect(() => {
    const ordersTotal = users.flatMap((u) =>
      (u.order || []).map((o) => ({
        ...o,
        userID: u.id,
        userName: u.name,
      }))
    );

    const sort = ordersTotal.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const lastFive = sort.slice(0, 5);
    setOrders(lastFive);
  }, [users]);

  const lineChartData = orders.reduce((acc, order) => {
    const date = new Date(order.date).toLocaleDateString();
    const revenue = Number(order.price) * Number(order.quantity);

    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing.revenue += revenue;
    } else {
      acc.push({ date, revenue });
    }

    return acc;
  }, []);

  lineChartData.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div>
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p>An error occurred. Please try again later. {String(error)}</p>
        ) : (
          <>{/* normal dashboard UI */}</>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold">{userLength}</p>
              <div className="flex items-center mt-1"></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-blue-100 text-sm font-medium"> Total Product </p>
            <p className="text-3xl font-bold"> {productLenth}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-blue-100 text-sm font-medium"> Total Revenue </p>
            <p className="text-3xl font-bold"> {totalRevenue}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-6 p-4 bg-white rounded-lg shadow-md">
          <div className="flex-1 flex justify-center items-center p-4 bg-gray-50 rounded-lg shadow-sm">
            <CircleChart data={chartData} />
          </div>

          {/* Line Chart */}
          <div className="flex-1 p-4 bg-gray-50 rounded-lg shadow-sm">
            <LineChartCompo data={lineChartData} title="Revenue Over Time" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <ul>
            {orders.map((order) => (
              <li key={order.id} className="border-b py-2">
                <p>
                  <strong>{order.title}</strong> — {order.userName} (
                  {order.status})
                </p>
                <p>
                  Date: {order.date} | Qty: {order.quantity} | ₹{order.price}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
