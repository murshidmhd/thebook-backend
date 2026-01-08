import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import api from "../../services/api";

function OrderDetails() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newAddress, setNewAddress] = useState({
    type: "home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get("/address/");
      setAddresses(response.data);

      const defaultAddr = response.data.find((addr) => addr.is_default);
      if (defaultAddr) setSelectedAddress(defaultAddr);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setLoading(false);
    }
  };

  // const handleAddressSelect = (address) => {
  //   setSelectedAddress(address);
  // };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/address/", newAddress);

      setAddresses([...addresses, response.data]);
      setSelectedAddress(response.data);
      setShowAddForm(false);

      toast.success("Address saved!");
    } catch (error) {
      toast.error("Could not save address. Check your fields.");
      console.log(error);
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    navigate("/paymentpage", {
      state: {
        address: selectedAddress,
        subtotal,
      },
    });
  };

  // const handlePlaceOrder = async () => {
  //   if (!selectedAddress) {
  //     toast.error("Please select a delivery address");
  //     return;
  //   }

  //   const payload = {
  //     address_id: selectedAddress.id,
  //     items: cartItems.map((item) => ({
  //       product_id: item.product.id,
  //       quantity: item.quantity,
  //     })),
  //   };

  //   try {
  //     const response = await api.post("/orders/create/", payload);

  //     navigate("/paymentpage", {
  //       state: {
  //         orderId: response.data.order_id,
  //         address: selectedAddress,
  //         subtotal: subtotal,
  //       },
  //     });
  //   } catch (error) {
  //     toast.error("Failed to process order");
  //     console.log(error);
  //   }
  // };

  if (loading) return <div>Loading addresses...</div>;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Items ({cartItems.length})
        </h2>
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-2 border-b">
            {/* {console.log(item)} */}

            <img
              src={item.product.image_url}
              alt={item.product.title}
              className="w-12 h-16 object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.product.title}</h3>
              <p className="text-sm text-gray-600">by {item.product.author}</p>
              <p className="text-sm">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">
              ₹{item.product.price * item.quantity}
            </p>
          </div>
        ))}
        <div className="pt-4 text-right">
          <p className="text-lg font-bold">Subtotal: ₹{subtotal}</p>
        </div>
      </div>

      {/* Address Selection */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Delivery Address</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add New Address
          </button>
        </div>

        {/* Address List */}
        {addresses.length > 0 ? (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded p-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={selectedAddress?.id === address.id}
                    onChange={() => setSelectedAddress(address)}
                    className="mt-1"
                  />
                  <div>
                    <div className="flex gap-2">
                      <span className="font-medium capitalize">
                        {address.type}
                      </span>
                      {address.isDefault && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p>Phone: {address.phone}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No addresses found. Please add a delivery address.
          </p>
        )}

        {/* Add Address Form */}
        {showAddForm && (
          <form onSubmit={handleAddAddress} className="mt-4 border-t pt-4">
            <h3 className="font-medium mb-3">Add New Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newAddress.type}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, type: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>

              <input
                type="text"
                placeholder="Street Address"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />

              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />

              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />

              <input
                type="text"
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, pincode: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleAddAddress}
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Place Order Button */}
      <div className="text-center">
        <button
          disabled={!selectedAddress}
          onClick={handlePlaceOrder} // This is the function we discussed in the last step
        >
          Proceed with {selectedAddress?.city} address
        </button>
      </div>
    </div>
  );
}

export default OrderDetails;
