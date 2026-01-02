import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./features/auth/Login";
import Register from "./features/auth/Ragister";
import Navbar from "./components /Navbar";
// import HomePage from "./components /Home";
import SlideShow from "./Pages/Home";
import Shop from "./Pages/Shop";
// import AddListing from "./features/products/AddListing";
import Cart from "./Pages/Cart";
// import ProtectedRoute from "./features/auth/PortectedRoute";
import Wishlist from "./Pages/Wish";
import OrderPage from "./features/products/Orders";
import Profile from "./features/auth/Profile";
import OrderDetails from "./features/products/OrderDetails";
import ViewDetails from "./features/products/ViewDetails";
import { Toaster } from "react-hot-toast";
import PaymentPage from "./features/products/PaymentPage";
import AdminPage from "./Admin/Pages/AdminPage";
import Dashboard from "./Admin/layout.jsx/DashBoard";
import ProductList from "./Admin/layout.jsx/ProductList";
import UserList from "./Admin/layout.jsx/UserList";
import AdminRoute from "./Admin/component/AdminRoute";
import Orders from "./Admin/layout.jsx/Orders";
import { ToastContainer } from "react-toastify";
import ListingsPreview from "./components /ListingsPreview";
import ListingView from "./components /ListingView";

function App() {
  //  this is for hide nabar
  const location = useLocation();
  // const hideNavbar = ["/login", "/register", "/admin"];
  // const showNavbar = !hideNavbar.includes(location.pathname);
  // console.log(showNavbar);

  // by using this we can remove navbar from in all sub pages of adminn
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  const showNavbar = !hideNavbar;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {showNavbar && <Navbar />}
      <Routes>
        {/* user route */}
        <Route path="/shop" element={<Shop />} />
        {/* <Route path="/addlisting" element={<AddListing />} /> */}
        <Route path="/" element={<SlideShow />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/" element={<ListingsPreview />} />
        <Route path="/listings/:id" element={<ListingView />} />
        {/* <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        ></Route> */}
        <Route path="/cart/" element={<Cart />}></Route>
        <Route path="/wishlist" element={<Wishlist />}></Route>
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/orders/:id" element={<ViewDetails />}></Route>
        <Route path="/orderdetails" element={<OrderDetails />}></Route>
        <Route path="paymentpage" element={<PaymentPage />} />

        {/* admin route */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="users" element={<UserList />} />
          <Route path="orders" element={<Orders />}></Route>
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // Default options for all toasts
          className: "",
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "#22c55e", // green
              color: "white",
            },
          },
          error: {
            style: {
              background: "#ef4444", // red
              color: "white",
            },
          },
        }}
      />
    </>
  );
}

export default App;
