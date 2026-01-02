import { createContext, useState, useEffect, useContext } from "react";
// import AddListing from "../features/products/AddListing";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../Admin/Context/AuthContext";
const WishListContext = createContext();

function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const fetchWishList = async () => {
    try {
      const res = await api.get("/wishlist/");
      setWishlist(res.data.wishlist_items || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchWishList();
  }, [isAuthenticated]);

  // const toggleWishlist = async (product) => {
  //   const isCurrentlyInWishlist = wishlist.some(
  //     (item) => item.product.id === product.id
  //   );

  //   if (isCurrentlyInWishlist) {
  //     setWishlist(wishlist.filter((item) => item.product.id !== product.id));
  //   } else {
  //     setWishlist([...wishlist, { product: product }]);
  //   }

  //   try {
  //     await api.post("/wishlist/", { product_id: product.id });
  //   } catch (err) {
  //     fetchWishList();
  //     toast.error("Could not sync wishlist");
  //   }
  // };

  const addToWishlist = async (product) => {
    try {
      // 1. Tell the server to add it
      await api.post("/wishlist/", { product_id: product.id });
      // 2. Refresh the whole list so the UI stays in sync
      fetchWishList();
      toast.success("Added!");
    } catch (err) {
      toast.error("Error adding item");
      console.log(err)

    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.post("/wishlist/", { product_id: productId });
      fetchWishList();
      toast.error("Removed!");
    } catch (err) {
      toast.error("Error removing item");
      console.log(err)

    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };
  return (
    <WishListContext.Provider
      value={{
        wishlist,
        clearWishlist,
        removeFromWishlist,
        addToWishlist,
      }}
    >
      {children}
    </WishListContext.Provider>
  );
}

const useWishlist = () => useContext(WishListContext);

export { useWishlist, WishlistProvider };
