import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showChangeModal, setShowChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // if (!userId) {
    //   setError("⚠️ No user logged in");
    //   setLoading(false);
    //   return;
    // }
    api
      .get("/accounts/profile/")
      .then((res) => {
        console.log(res);
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("❌ Failed to fetch user data");
        setLoading(false);
      });
  }, []);

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      alert("Please enter a new password");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/users/${user.id}`, {
        ...user,
        password: newPassword,
      });

      alert("✅ Password updated successfully!");
      setShowChangeModal(false);
      setNewPassword("");
    } catch (err) {
      alert("❌ Failed to update password");
      console.error(err);
    }
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* Profile Info */}
        <h1 className="text-2xl font-bold text-center text-gray-800">
          👤 Profile
        </h1>
        <div className="bg-gray-50 rounded-xl p-4 shadow-inner space-y-2">
          <p>
            <strong>Name:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        {/* Settings */}
        <div className="pt-4 space-y-3">
          <button
            onClick={() => setShowChangeModal(true)}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Edit Password
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("userId");
              toast.success("you have successfully logged out of your account");
              navigate("/login");
            }}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6">
            <h2 className="text-xl font-semibold mb-4">🔒 Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              >
                Save Password
              </button>
              <button
                type="button"
                onClick={() => setShowChangeModal(false)}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
