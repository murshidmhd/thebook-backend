import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import api from "../../services/api";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [newAddress, setNewAddress] = useState({
    type: "home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/shop");
      return;
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/address/");
      setAddresses(res.data);

      const defaultAddr = res.data.find((a) => a.is_default);
      if (defaultAddr) setSelectedAddress(defaultAddr);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/address/", newAddress);
      setAddresses((prev) => [...prev, res.data]);
      setSelectedAddress(res.data);
      setShowAddForm(false);
      toast.success("Address added");
    } catch {
      toast.error("Failed to save address");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || placingOrder) return;

    setPlacingOrder(true);

    const payload = {
      address_id: selectedAddress.id,
      items: cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await api.post("/orders/create/", payload);

      navigate("/paymentpage", {
        state: {
          orderId: res.data.order_id,
          address: selectedAddress,
          subtotal,
        },
      });
    } catch {
      toast.error("Failed to place order");
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading checkout...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Cart Summary */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="font-semibold mb-4">
          Items ({cartItems.length})
        </h2>

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 py-3 border-b last:border-b-0"
          >
            <img
              src={item.product.image_url}
              alt={item.product.title}
              className="w-12 h-16 object-cover"
            />
            <div className="flex-1">
              <p className="font-medium">{item.product.title}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>
            <p className="font-semibold">
              ₹{item.product.price * item.quantity}
            </p>
          </div>
        ))}

        <div className="text-right mt-4 font-bold">
          Subtotal: ₹{subtotal}
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Delivery Address</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-blue-600 text-sm"
          >
            + Add new
          </button>
        </div>

        {addresses.length === 0 && (
          <p className="text-gray-500">No address found</p>
        )}

        <div className="space-y-3">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className="flex gap-3 border rounded p-3 cursor-pointer"
            >
              <input
                type="radio"
                checked={selectedAddress?.id === addr.id}
                onChange={() => setSelectedAddress(addr)}
              />
              <div>
                <p className="font-medium capitalize">{addr.type}</p>
                <p className="text-sm text-gray-600">
                  {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-sm">Phone: {addr.phone}</p>
              </div>
            </label>
          ))}
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAddAddress}
            className="mt-4 border-t pt-4 grid gap-3"
          >
            <input
              placeholder="Street"
              required
              className="border p-2 rounded"
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
            />
            <input
              placeholder="City"
              required
              className="border p-2 rounded"
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            <input
              placeholder="State"
              required
              className="border p-2 rounded"
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
            />
            <input
              placeholder="Pincode"
              required
              className="border p-2 rounded"
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
            />
            <input
              placeholder="Phone"
              required
              className="border p-2 rounded"
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
            />

            <div className="flex gap-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Place Order */}
      <button
        disabled={!selectedAddress || placingOrder}
        onClick={handlePlaceOrder}
        className="w-full bg-blue-600 text-white py-3 rounded disabled:opacity-50"
      >
        {placingOrder
          ? "Placing order..."
          : `Proceed with ${selectedAddress?.city}`}
      </button>
    </div>
  );
}

export default CheckoutPage;
