import React, { useState, useEffect } from "react";
import { useAuth } from "../Admin/Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../features/context/CartContext";
import { useWishlist } from "../features/context/WishListContext";

function Navbar() {
  const [cartCount, setCartCount] = useState();
  const [wishlistCount, setWishlistCount] = useState();

  const [isScrolled, setIsScrolled] = useState(false);
  // const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const navigate = useNavigate();

const { isAuthenticated, logout } = useAuth();

  const { clearCart, cartItems } = useCart();
  const { clearWishlist, wishlist } = useWishlist();

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
  logout();          // clears tokens + user state
  clearCart();
  clearWishlist();
  navigate("/login");
};


  // const userId = localStorage.getItem("userId");
  // useEffect(() => {
  //   const response = axios
  //     .get(`http://localhost:3000/users/${userId}`)
  //     .then((res) => setCartCount(res.data.cart.length))
  //     .then(console.log(cartCount))
  //     .catch(() => console.log("fetching issue "));
  //   // console.log(res);
  // });

  // console.log(cartItems);

  useEffect(() => {
    setCartCount(cartItems.length);
  }, [cartItems.length]);

  useEffect(() => {
    setWishlistCount(wishlist.length);
  }, [wishlist.length]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
            : "bg-white py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-2 rounded-lg">
                <span className="text-white font-bold text-xl">TB</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                TheBook
              </span>
            </Link>

            {/* Center navigation - Desktop */}
            <div className="hidden md:flex space-x-10 font-medium">
              <Link
                to="/"
                className="text-gray-700 hover:text-cyan-600 transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 hover:text-cyan-600 transition-colors duration-200 relative group"
              >
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link
                to="/orders"
                className="text-gray-700 hover:text-cyan-600 transition-colors duration-200 relative group"
              >
                Orders
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-600 transition-all group-hover:w-full"></span>
              </Link>
            </div>

            {/* icon */}
            <div className="flex items-center space-x-5">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 text-gray-600 hover:text-cyan-600 transition-colors duration-200 relative group"
              >
                <HeartIcon className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-cyan-100 text-cyan-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold group-hover:scale-110 transition-transform">
                  {wishlistCount}
                </span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart/"
                className="p-2 text-gray-600 hover:text-cyan-600 transition-colors duration-200 relative group"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold group-hover:scale-110 transition-transform">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Login or Logout  */}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span className="font-medium">Login</span>
                </Link>
              ) : (
                <div className="relative group">
                  <button className="hidden sm:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray -200 transition-colors duration-200">
                    <UserCircleIcon className="w-5 h-5 text-gray-700" />
                    <span className="font-medium text-gray-700">Account</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                    <Link
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      to={"/profile"}
                    >
                      {" "}
                      Profile{" "}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding to content to account for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;
