import React from "react";
import StatsCard from "./StatsCard";

const StatsSection = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard title="Total Users" value={stats.totalUsers} />
      <StatsCard title="Total Stores" value={stats.totalStores} />
      <StatsCard title="Total Ratings" value={stats.totalRatings} />
    </div>
  );
};

export default StatsSection;