import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AddStoreForm = () => {
  const [isOpen, setIsOpen] = useState(false); // controls modal/form open
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newStore = { name, address };

    try {
      const response = await fetch("http://localhost:5000/api/stores/createStoreOwner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStore),
      });

      if (response.ok) {
        alert("Store added successfully!");
        setIsOpen(false);
        setName("");
        setAddress("");
        navigate(0); // refresh dashboard
      } else {
        alert("Failed to add store");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start my-6">
      {/* Button to open form */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        <span className="text-xl font-bold">+</span>
        <span className="font-medium">Add Store</span>
      </button>

      {/* Form modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Add New Store
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Store Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Add Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStoreForm;
