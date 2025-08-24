import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import AddStoreForm from "../components/AddStoreForm";
import { useNavigate } from "react-router-dom";

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { api } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/api/stores/my-store");
        setDashboardData(response.data.stores || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [api]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Add Store Button/Form */}
      <div className="p-6">
        <AddStoreForm />
      </div>

      {/* My Stores Section */}
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Stores</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading stores...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-600">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : dashboardData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-600">
            <p>You don't have any stores assigned to you yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.map((store) => (
              <div
                key={store.id}
                className="bg-white border rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {store.storeName}
                </h2>
                <p className="text-gray-600">{store.storeAddress}</p>
                <p className="mt-3">
                  <span className="font-medium text-gray-700">Rating:</span>{" "}
                  <span className="text-blue-600 font-semibold">
                    {store.averageRating}
                  </span>
                </p>
                <button
                  onClick={() => navigate(`/store/${store.id}`)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
