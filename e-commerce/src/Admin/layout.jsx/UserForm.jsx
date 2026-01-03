// import axios from "axios";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import api from "../../services/api";

// function UserForm({ setShowAddForm, fetchUsers, editUser, setEditUser }) {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     role: "",
//     password: "",
//   });

//   useEffect(() => {
//     if (editUser) {
//       setFormData({
//         username: editUser.username || "",
//         email: editUser.email || "",
//         role: editUser.role || "",
//         password: "",
//       });
//     }
//   }, [editUser]);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editUser) {
//         await api.put(`dashboard/users/${editUser.id}/`, formData);
//         toast.success("updated user");
//         setEditUser(null);
//       } else {
//         await api.post("dashboard/users/", formData);
//         toast.success("added user");
//       }

//       setShowAddForm(false);
//       setFormData({ username: "", email: "", role: "", password: "" });
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Failed to save user");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white p-6 rounded-lg shadow-md mb-6"
//     >
//       <h2 className="text-xl font-semibold mb-4">
//         {editUser ? "Update User" : "Add New User"}
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={formData.username}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />
//         <select
//           name="role"
//           value={formData.role}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         >
//           <option value="">Select Role</option>
//           <option value="admin">admin</option>
//           <option value="user">user</option>
//           <option value="Moderator">Moderator</option>
//         </select>
//         <input
//           type="password"
//           name="password"
//           placeholder={
//             editUser ? "New Password (leave blank to keep current)" : "Password"
//           }
//           value={formData.password}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required={!editUser}
//         />
//       </div>

//       <div className="flex gap-3">
//         <button
//           type="submit"
//           className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//         >
//           {editUser ? "Update" : "Save"}
//         </button>
//         <button
//           type="button"
//           onClick={() => {
//             setShowAddForm(false);
//             setEditUser && setEditUser(null);
//           }}
//           className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }

// export default UserForm;
