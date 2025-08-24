import React from "react";

const StatsCard = ({ title, value, className = "" }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 ${className}`}>
      <h3 className="text-gray-600 font-medium">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
    </div>
  );
};

export default StatsCard;