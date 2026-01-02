import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await api.post("/accounts/register/", {
        username,
        email,
        password,
        password2,
      });

      toast.success(res.data.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      setError("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div
        className="relative"
        style={{ minWidth: "320px", minHeight: "430px" }}
      >
        <div className="absolute inset-0 w-80 h-100 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl transform rotate-6" />

        <div className="relative w-80 h-100 bg-white p-8 rounded-2xl shadow-lg z-10">
          <h2 className="text-2xl font-bold text-center mb-7 text-gray-800">
            Register
          </h2>

          {error && (
            <div className="mb-4 text-red-600 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-cyan-500 bg-transparent"
              required
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-cyan-500 bg-transparent"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-cyan-500 bg-transparent"
              required
            />

            <input
              type="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Confirm password"
              className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-cyan-500 bg-transparent"
              required
            />

            <button
              type="submit"
              className="w-full py-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-md font-semibold"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-500 font-medium hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
