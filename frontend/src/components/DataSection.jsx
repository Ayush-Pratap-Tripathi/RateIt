import React, { useEffect } from "react";
import FilterComponent from "./FilterComponent";
import DataTable from "./DataTable";

const DataSection = ({
  title,
  data,
  filteredData,
  filters,
  onFilterChange,
  onReset,
  filterOptions,
  isExpanded,
  onToggle,
  columns,
  emptyMessage
}) => {
  // Auto-expand when filters are applied
  useEffect(() => {
    const hasActiveFilters = Object.values(filters).some(value => value && value.trim() !== "");
    if (hasActiveFilters && !isExpanded) {
      onToggle();
    }
  }, [filters, isExpanded, onToggle]);

  return (
    <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <FilterComponent 
          filters={filters}
          onFilterChange={onFilterChange}
          onReset={onReset}
          filterOptions={filterOptions}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      </div>
      
      {isExpanded && (
        <DataTable 
          data={filteredData} 
          columns={columns}
          emptyMessage={emptyMessage}
          showCount={true}
          totalCount={data.length}
        />
      )}
      
      {!isExpanded && Object.values(filters).some(value => value && value.trim() !== "") && (
        <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
          <p>Table is filtered. Expand to view {filteredData.length} matching records.</p>
          <button 
            onClick={onToggle}
            className="mt-2 text-blue-600 hover:text-blue-800 underline"
          >
            Show filtered results
          </button>
        </div>
      )}
    </section>
  );
};

export default DataSection;