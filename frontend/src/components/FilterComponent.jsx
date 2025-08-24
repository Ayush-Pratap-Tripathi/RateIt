import React, { useState, useEffect } from "react";

const FilterComponent = ({ filters, onFilterChange, onReset, filterOptions, isExpanded, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Auto-expand when a filter is applied while collapsed
  useEffect(() => {
    if (Object.keys(filters).length > 0 && !isExpanded) {
      onToggle();
    }
  }, [filters, isExpanded, onToggle]);

  const handleFilterSelect = (filterType) => {
    setCurrentFilter(filterType);
    setInputValue(filters[filterType] || "");
    setIsOpen(false);
    
    // Expand if selecting a filter while collapsed
    if (!isExpanded) {
      onToggle();
    }
  };

  const applyFilter = () => {
    if (currentFilter) {
      onFilterChange(currentFilter, inputValue);
    }
  };

  const resetAll = () => {
    setCurrentFilter("");
    setInputValue("");
    onReset();
    setIsOpen(false);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value && value.trim() !== "");

  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={onToggle}
        className={`inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-md ${
          hasActiveFilters 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-gray-100 text-gray-700'
        } hover:bg-opacity-80`}
        title={isExpanded ? "Collapse table" : "Expand table"}
      >
        {isExpanded ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
        {hasActiveFilters && (
          <span className="ml-1 w-2 h-2 rounded-full bg-blue-500"></span>
        )}
      </button>
      
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            hasActiveFilters
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          Filter
          {hasActiveFilters && (
            <span className="ml-1 text-xs font-bold">
              {Object.values(filters).filter(v => v && v.trim() !== "").length}
            </span>
          )}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {filterOptions.map((option) => {
                const isActive = filters[option.value] && filters[option.value].trim() !== "";
                return (
                  <button
                    key={option.value}
                    onClick={() => handleFilterSelect(option.value)}
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    role="menuitem"
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                  </button>
                );
              })}
              <button
                onClick={resetAll}
                className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 w-full text-left border-t border-gray-100"
                role="menuitem"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {currentFilter && (
          <div className="mt-2 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Filter by ${currentFilter}`}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              onKeyPress={(e) => e.key === 'Enter' && applyFilter()}
            />
            <button
              onClick={applyFilter}
              className="ml-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setCurrentFilter("");
                setInputValue("");
              }}
              className="ml-2 px-3 py-1 text-gray-600 text-sm rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetAll}
          className="px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
          title="Clear all filters"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default FilterComponent;