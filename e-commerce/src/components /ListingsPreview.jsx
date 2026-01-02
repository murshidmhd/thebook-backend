import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ListingsPreview = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/products/")
      .then((res) => {
        // console.log(res);
        setListings(res.data.results);
      })
      .catch(() => setError("Failed to load listings."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 font-medium">{error}</div>
        </div>
      </div>
    );
  }

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case "new":
        return "text-green-600 bg-green-50 border-green-200";
      case "like new":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "good":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "acceptable":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeDisplay = (item) => {
    if (item.type === "sale") {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">
            ₹{item.price}
          </span>
        </div>
      );
    }
    if (item.type === "donation") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
          Free
        </span>
      );
    }
    if (item.type === "bogo") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
          BOGO Offer
        </span>
      );
    }
    return null;
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Listings
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing books from our curated collection. From classics to
            contemporary, find your next great read at unbeatable prices.
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6 mb-12">
          {listings.map((item) => (
            <Link
              key={item.id}
              to={`/listings/${item.id}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-cyan-200 transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <div className="aspect-[3/4] w-full">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x400/e2e8f0/64748b?text=No+Image";
                    }}
                  />
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Quick view button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                    <svg
                      className="w-5 h-5 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Title and Author */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium">
                    {item.author}
                  </p>
                </div>

                {/* Price and Condition */}
                <div className="flex items-center justify-between mb-3">
                  <div>{getTypeDisplay(item)}</div>
                </div>

                {/* Condition Badge */}
                <div className="flex justify-between items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getConditionColor(
                      item.condition
                    )}`}
                  >
                    {item.condition}
                  </span>

                  {/* Arrow icon */}
                  <div className="text-cyan-500 transform group-hover:translate-x-1 transition-transform duration-300">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/shop"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            <span className="relative z-10 flex items-center">
              View All Listings
              <svg
                className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>

            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ListingsPreview;
