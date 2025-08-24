import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const StoreDetails = () => {
  const { storeId } = useParams();
  const { api } = useAuth();
  const navigate = useNavigate(); // for back button
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await api.get(`/api/stores/my-store/${storeId}`);
        setDashboardData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch store details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStoreDetails();
  }, [api, storeId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading store details...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6 max-w-6xl mx-auto">
        {/* Title with Back button */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-4">
          {dashboardData.storeName} Dashboard
          <span
            onClick={() => navigate(-1)} // go back to previous page
            className="text-sm text-blue-600 font-medium cursor-pointer hover:underline"
          >
            (Back)
          </span>
        </h2>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Average Rating
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {dashboardData.averageRating}
          </p>
        </div>

        {/* Table Section */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Users Who Rated Your Store
        </h3>
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-gray-700">
                <th className="px-4 py-3 border-b">User Name</th>
                <th className="px-4 py-3 border-b">User Email</th>
                <th className="px-4 py-3 border-b">Rating Given</th>
                <th className="px-4 py-3 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.raters && dashboardData.raters.length > 0 ? (
                dashboardData.raters.map((rater, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 border-b">{rater.name}</td>
                    <td className="px-4 py-3 border-b">{rater.email}</td>
                    <td className="px-4 py-3 border-b font-medium text-blue-600">
                      {rater.rating}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {new Date(rater.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No ratings have been submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default StoreDetails;
