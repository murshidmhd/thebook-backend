import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import {
  NoSymbolIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("dashboard/users/", {
        params: { search: searchTerm },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (user) => {
    const newStatus = !user.is_active;
    const action = newStatus ? "activate" : "block";

    if (!window.confirm(`Are you sure you want to ${action} ${user.username}?`))
      return;

    try {
      // Calling the PATCH method we created in Django
      await api.patch(`dashboard/users/${user.id}/`, {
        is_active: newStatus,
      });

      toast.success(`User ${newStatus ? "Activated" : "Blocked"}`);
      fetchUsers(); // Refresh the list to see the UI change
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-slate-800 mb-8">
          User Directory
        </h1>

        {/* Modern Search Bar */}
        <div className="relative mb-6">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search readers by name or email..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-slate-600 font-semibold">
                  Reader Details
                </th>
                <th className="p-4 text-slate-600 font-semibold text-center">
                  Status
                </th>
                <th className="p-4 text-slate-600 font-semibold text-center">
                  Permissions
                </th>
                <th className="p-4 text-slate-600 font-semibold text-right">
                  Access Control
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="group hover:bg-slate-50/80 transition-all duration-200"
                >
                  {/* 1. READER DETAILS - Primary Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 uppercase">
                        {user.username.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900 leading-tight capitalize">
                          {user.username}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. STATUS - Compact Badge */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border ${
                        user.is_active
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                          user.is_active
                            ? "bg-green-500 animate-pulse"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {user.is_active ? "Verified" : "Restricted"}
                    </span>
                  </td>

                  {/* 3. PERMISSIONS - Subtle Text */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`text-[11px] font-black tracking-widest uppercase ${
                        user.is_staff ? "text-indigo-600" : "text-slate-400"
                      }`}
                    >
                      {user.is_staff ? "Staff / Admin" : "Customer"}
                    </span>
                  </td>

                  {/* 4. ACTIONS - Styled Buttons */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleToggleBlock(user)}
                      className={`text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-lg transition-all border shadow-sm ${
                        user.is_active
                          ? "bg-white text-red-500 border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500"
                          : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200"
                      }`}
                    >
                      {user.is_active ? "Restrict Access" : "Grant Access"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>{" "}
          </table>
          {users.length === 0 && !loading && (
            <div className="p-10 text-center text-slate-400">
              No readers found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;





