import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import { toast } from "react-toastify";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import api from "../../services/api";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("dashboard/products/");
      setProducts(res.data);
    } catch (error) {
      toast.error("❌ Failed to fetch products");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete("dashboard/products/", {
        data: {
          product_id: id,
        },
      });
      toast.info("🗑️ Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("❌ Failed to delete product");
      console.error(error);
    }
  };
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className={`font-bold py-2 px-4 rounded transition-colors duration-200 
    ${
      showForm
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-blue-500 hover:bg-blue-700 text-white"
    }`}
        >
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 transition-all duration-500 ease-in-out transform scale-95 animate-fadeIn">
          <ProductForm
            fetchProducts={fetchProducts}
            editProduct={editProduct}
            setEditProduct={setEditProduct}
            setShowForm={setShowForm}
          />
        </div>
      )}

      <h1 className="text-5xl font-extrabold mb-8 text-gray-900">
        Product Management
      </h1>
      <div className="flex items-center border rounded-lg px-3 py-2 w-full md:w-1/3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="outline-none w-full"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 flex flex-col items-center"
          >
            <img
              src={product.image_url}
              alt={product.title}
              className="w-32 h-50 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-lg text-gray-900">
              {product.title}
            </h3>
            <p className="text-gray-600 text-sm">
              by {product.author} ({product.type})
            </p>
            <p className="text-gray-800 font-medium mt-1">₹{product.price}</p>
            <span className="text-xs text-gray-500 mt-1">
              Condition: {product.condition}
            </span>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setEditProduct(product);
                  setShowForm(true);
                }}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
