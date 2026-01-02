// src/pages/ListingView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../features/context/CartContext";
import toast from "react-hot-toast";
import api from "../services/api";

function ListingView() {
  const { cartItems, addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`products/${id}`)
      .then((res) => setListing(res.data))
      .catch(() => setError("Failed to load listing."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    const alreadyInCart = cartItems.some((item) => item.id === listing.id);

    if (alreadyInCart) {
      toast.error("Already in cart");
    } else {
      addToCart(listing);
    }
  };
  if (loading) return <p className="p-6 text-gray-500">Loading…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Book Image */}
        <div className="w-full flex justify-center">
          <img
            src={listing.image_url}
            alt={listing.title}
            className=" h-[500px] object-contain rounded-lg border"
          />
        </div>

        {/* Right side - Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <p className="text-gray-600 mb-4">by {listing.author}</p>

          <div className="flex items-center gap-4 mb-4">
            {listing.type === "sale" && (
              <span className="text-2xl text-indigo-600 font-bold">
                ₹{listing.price}
              </span>
            )}
            {listing.type === "donation" && (
              <span className="text-xl text-green-600 font-semibold">Free</span>
            )}
            {listing.type === "bogo" && (
              <span className="text-xl text-yellow-600 font-semibold">
                BOGO Offer
              </span>
            )}
            <span className="text-gray-500">
              Condition: {listing.condition}
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            {listing.description || "No description available."}
          </p>

          {/* Buttons at bottom */}
          <div className="mt-auto flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700"
            >
              Add to Cart
            </button>
            <button
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingView;
