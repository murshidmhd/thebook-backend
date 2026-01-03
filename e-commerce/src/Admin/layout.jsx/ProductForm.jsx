import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { XMarkIcon, BookOpenIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

function ProductForm({ setShowForm, fetchProducts, editProduct, setEditProduct }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    type: "",
    price: "",
    condition: "",
    imageUrl: "",
  });

  const CONDITIONS = ["New", "Like New", "Very Good", "Good", "Acceptable"];
  const TYPES = ["Hardcover", "Paperback", "E-book", "Audiobook"];

  useEffect(() => {
    if (editProduct) {
      setFormData({
        title: editProduct.title || "",
        author: editProduct.author || "",
        type: editProduct.type || "",
        price: editProduct.price || "",
        condition: editProduct.condition || "",
        imageUrl: editProduct.imageUrl || "",
      });
    }
  }, [editProduct]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, price: Number(formData.price) || 0 };

    try {
      if (editProduct) {
        await api.put("dashboard/products/", { product_id: editProduct.id, ...data });
        toast.success("Book details updated");
      } else {
        await api.post("dashboard/products/", data);
        toast.success("New book added to catalog");
      }
      setShowForm(false);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error("Failed to save book");
    }
  };

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200 py-8 px-6 mb-10 shadow-sm animate-in fade-in zoom-in duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-slate-800">
            {editProduct ? "Edit Catalog Entry" : "Add to Collection"}
          </h2>
          <button onClick={() => { setShowForm(false); setEditProduct(null); }} className="text-slate-400 hover:text-slate-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Book Title" className="border-slate-200 border p-3 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" required />
          <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Author Name" className="border-slate-200 border p-3 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" required />
          <select name="type" value={formData.type} onChange={handleChange} className="border-slate-200 border p-3 rounded-md bg-white outline-none" required>
            <option value="">Format</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price (₹)" className="border-slate-200 border p-3 rounded-md outline-none" required />
          <select name="condition" value={formData.condition} onChange={handleChange} className="border-slate-200 border p-3 rounded-md bg-white outline-none" required>
            <option value="">Condition</option>
            {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="file" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Cover Image URL" className="border-slate-200 border p-3 rounded-md outline-none" required />
          
          <div className="md:col-span-3 flex justify-end gap-3 mt-2">
             <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-md font-medium transition-colors flex items-center gap-2">
              {editProduct ? <ArrowPathIcon className="h-4 w-4"/> : <BookOpenIcon className="h-4 w-4"/>}
              {editProduct ? "Update Book" : "List Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;