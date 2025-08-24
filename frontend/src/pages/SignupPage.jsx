import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { api } = useAuth();
  const navigate = useNavigate();

  // Validation functions
  const validateName = (name) => {
    if (name.length > 60) {
      return "Name must be maximum 60 characters";
    }
    return "";
  };

  const validateAddress = (address) => {
    if (address.length > 400) {
      return "Address must be maximum 400 characters";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 16) {
      return "Password must be between 8-16 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must include at least one uppercase letter";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must include at least one special character";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate inputs before submitting
    const nameError = validateName(name);
    const addressError = validateAddress(address);
    const passwordError = validatePassword(password);

    if (nameError || addressError || passwordError) {
      setError(nameError || addressError || passwordError);
      return;
    }

    try {
      await api.post("api/auth/register", {
        name,
        email,
        address,
        password,
        role,
      });
      setSuccess("Registration successful! Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to sign up. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
          Sign Up
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={60}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              {name.length}/60 characters
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={2}
              maxLength={400}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              {address.length}/400 characters
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={16}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              8-16 chars, uppercase, special char
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-600 mb-1 text-sm">Role</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="USER">User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>

          {/* Messages */}
          {error && (
            <p className="text-red-600 text-sm font-medium py-1 px-2 bg-red-50 rounded">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 text-sm font-medium py-1 px-2 bg-green-50 rounded">
              {success}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Switch link */}
        <p className="text-center text-gray-600 text-xs mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;