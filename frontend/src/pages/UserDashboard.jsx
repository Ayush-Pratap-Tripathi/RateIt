import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name"); // 'name' or 'address'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { api } = useAuth();

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append(searchType, searchTerm);
      }
      const response = await api.get(`/api/stores?${params.toString()}`);
      setStores(response.data);
    } catch (err) {
      setError("Failed to fetch stores.");
    } finally {
      setLoading(false);
    }
  }, [api, searchTerm, searchType]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      await api.post(`/api/stores/${storeId}/ratings`, { rating });
      fetchStores(); // Refresh ratings
    } catch (err) {
      alert("Failed to submit rating.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">All Stores</h2>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder={`Search by store ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Name</option>
            <option value="address">Address</option>
          </select>
          <button
            onClick={fetchStores}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading stores...</p>
          </div>
        )}
        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

        {/* Store List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading &&
            stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onRate={handleRatingSubmit}
              />
            ))}
        </div>
      </main>
    </div>
  );
};

// StoreCard Component
const StoreCard = ({ store, onRate }) => {
  const [rating, setRating] = useState(store.userSubmittedRating || 0);

  const handleRateClick = () => {
    if (rating > 0 && rating <= 5) {
      onRate(store.id, rating);
    } else {
      alert("Please select a rating between 1 and 5.");
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-gray-800">{store.name}</h3>
      <p className="text-gray-600">{store.address}</p>

      <div className="mt-3 space-y-1">
        <p>
          <span className="font-medium text-gray-700">Overall Rating:</span>{" "}
          <span className="text-blue-600 font-semibold">
            {store.overallRating}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-700">Your Rating:</span>{" "}
          <span className="text-gray-800 font-semibold">
            {store.userSubmittedRating || "Not Rated"}
          </span>
        </p>
      </div>

      <div className="mt-4 flex gap-2 items-center">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="flex-1 border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="0" disabled>
            Rate...
          </option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Fair</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Very Good</option>
          <option value="5">5 - Excellent</option>
        </select>
        <button
          onClick={handleRateClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {store.userSubmittedRating ? "Update" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
