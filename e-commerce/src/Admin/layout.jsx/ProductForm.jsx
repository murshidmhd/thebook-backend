import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import {
  XMarkIcon,
  BookOpenIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

function ProductForm({
  setShowForm,
  fetchProducts,
  editProduct,
  setEditProduct,
}) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    type: "",
    price: "",
    condition: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const CONDITIONS = ["new", "like_new", "very_good", "good", "acceptable"];
  const TYPES = ["sale", "bogo", "donation"];

  useEffect(() => {
    if (editProduct) {
      setFormData({
        title: editProduct.title || "",
        author: editProduct.author || "",
        type: editProduct.type || "",
        price: editProduct.price || "",
        condition: editProduct.condition || "",
      });
      setImageFile(null);
    }
  }, [editProduct]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("author", formData.author);
    form.append("type", formData.type);
    form.append("price", Number(formData.price) || 0);
    form.append("condition", formData.condition);

    if (imageFile) {
      form.append("image", imageFile); // 🔥 IMPORTANT
    }

    try {
      if (editProduct) {
        form.append("product_id", editProduct.id);
        await api.put("dashboard/products/", form);
        toast.success("Book updated successfully");
      } else {
        await api.post("dashboard/products/", form);
        toast.success("Book added successfully");
      }

      setShowForm(false);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save book");
    }
  };

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200 py-8 px-6 mb-10 shadow-sm">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-slate-800">
            {editProduct ? "Edit Catalog Entry" : "Add to Collection"}
          </h2>
          <button
            onClick={() => {
              setShowForm(false);
              setEditProduct(null);
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Book Title"
            required
          />

          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author Name"
            required
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Sale Type</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "bogo" ? "Buy One Get One" : t.toUpperCase()}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price (₹)"
            required
          />

          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
          >
            <option value="">Condition</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>

          {/* ✅ FILE INPUT (UNCONTROLLED) */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required={!editProduct}
          />

          <div className="md:col-span-3 flex justify-end gap-3 mt-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-2 rounded-md flex items-center gap-2"
            >
              {editProduct ? (
                <ArrowPathIcon className="h-4 w-4" />
              ) : (
                <BookOpenIcon className="h-4 w-4" />
              )}
              {editProduct ? "Update Book" : "List Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
