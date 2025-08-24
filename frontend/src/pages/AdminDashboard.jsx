import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import AddStoreFormAdmin from "../components/AddStoreFormAdmin";
import AddUserForm from "../components/AddUserForm";
import StatsSection from "../components/StatsSection";
import DataSection from "../components/DataSection";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [userFilters, setUserFilters] = useState({});
  const [storeFilters, setStoreFilters] = useState({});
  const [usersExpanded, setUsersExpanded] = useState(true);
  const [storesExpanded, setStoresExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { api } = useAuth();

  const userFilterOptions = [
    { value: "name", label: "Filter by Name" },
    { value: "email", label: "Filter by Email" },
    { value: "address", label: "Filter by Address" },
    { value: "role", label: "Filter by Role" },
  ];

  const storeFilterOptions = [
    { value: "name", label: "Filter by Name" },
    { value: "email", label: "Filter by Email" },
    { value: "address", label: "Filter by Address" },
  ];

  const userColumns = [
    {
      key: "name",
      title: "Name",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "address",
      title: "Address",
    },
    {
      key: "role",
      title: "Role",
      render: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          user.role === 'admin' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {user.role}
        </span>
      )
    }
  ];

  const storeColumns = [
    {
      key: "name",
      title: "Name",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "address",
      title: "Address",
    },
    {
      key: "overallRating",
      title: "Rating",
      render: (store) => (
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          {store.overallRating || 'No ratings'}
        </div>
      )
    }
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, storesRes] = await Promise.all([
        api.get("/api/stores/dashboard-stats"),
        api.get("/api/users"),
        api.get("/api/stores"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setFilteredUsers(usersRes.data);
      setStores(storesRes.data);
      setFilteredStores(storesRes.data);
    } catch (err) {
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply user filters whenever users or userFilters change
  useEffect(() => {
    let result = users;
    
    Object.entries(userFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(user => 
          user[key] && user[key].toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    
    setFilteredUsers(result);
  }, [users, userFilters]);

  // Apply store filters whenever stores or storeFilters change
  useEffect(() => {
    let result = stores;
    
    Object.entries(storeFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(store => 
          store[key] && store[key].toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    
    setFilteredStores(result);
  }, [stores, storeFilters]);

  const handleUserFilterChange = (filterType, value) => {
    setUserFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleStoreFilterChange = (filterType, value) => {
    setStoreFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const resetUserFilters = () => {
    setUserFilters({});
    setFilteredUsers(users);
  };

  const resetStoreFilters = () => {
    setStoreFilters({});
    setFilteredStores(stores);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-red-600 font-medium">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h2>

        {/* Add Store & User Forms */}
        <div className="flex gap-6 flex-wrap">
          <AddStoreFormAdmin />
          <AddUserForm />
        </div>

        {/* Stats Section */}
        <StatsSection stats={stats} />

        {/* Users Section */}
        <DataSection
          title="Users"
          data={users}
          filteredData={filteredUsers}
          filters={userFilters}
          onFilterChange={handleUserFilterChange}
          onReset={resetUserFilters}
          filterOptions={userFilterOptions}
          isExpanded={usersExpanded}
          onToggle={() => setUsersExpanded(!usersExpanded)}
          columns={userColumns}
          emptyMessage="No users match the current filters"
        />

        {/* Stores Section */}
        <DataSection
          title="Stores"
          data={stores}
          filteredData={filteredStores}
          filters={storeFilters}
          onFilterChange={handleStoreFilterChange}
          onReset={resetStoreFilters}
          filterOptions={storeFilterOptions}
          isExpanded={storesExpanded}
          onToggle={() => setStoresExpanded(!storesExpanded)}
          columns={storeColumns}
          emptyMessage="No stores match the current filters"
        />
      </main>
    </div>
  );
};

export default AdminDashboard;