import React from "react";
import { useCart } from "../features/context/CartContext";
import toast from "react-hot-toast";
import { useWishlist } from "../features/context/WishListContext";

function Wishlist() {
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const handelAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    console.log(product);
    toast.success("moved to cart");
  };

  const handelClearWishlsit = () => {
    clearWishlist();
    toast("clear wishlist");
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2">
          💖 My Wishlist
        </h2>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Your wishlist is empty.
          </p>
        ) : (
          <>
            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-6">
              {wishlist.map((item) => (
                <div key={item.id} className="...">
                  <div className="w-full h-64 bg-gray-100 flex items-center justify-center p-4">
                    <img
                      src={item.product.image_url}
                      alt={item.product.title}
                      className="object-contain h-full w-auto rounded"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-grow text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                      {item.product.title}
                    </h3>

                    <p className="text-xl font-bold text-blue-600 mb-4">
                      ${item.product.price}
                    </p>

                    <div className="mt-auto flex flex-col gap-2">
                      <button
                        onClick={() => removeFromWishlist(item.product.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        onClick={() => handelAddToCart(item.product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handelClearWishlsit}
                className="w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-900 transition font-medium"
              >
                Clear Wishlist
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
