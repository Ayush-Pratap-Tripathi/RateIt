import React from "react";

const DataTable = ({ 
  data, 
  columns, 
  emptyMessage = "No data available",
  showCount = false,
  totalCount = 0
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
        <table className="w-full text-left text-gray-700 text-sm compact-table">
          <thead className="bg-blue-50">
            <tr>
              {columns.map(column => (
                <th key={column.key} className="px-4 py-2 font-medium">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-4 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-700 text-sm compact-table">
          <thead className="bg-blue-50">
            <tr>
              {columns.map(column => (
                <th key={column.key} className="px-4 py-2 font-medium">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {columns.map(column => (
                  <td key={column.key} className="px-4 py-2">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {showCount && (
        <div className="mt-3 text-sm text-gray-500">
          Showing {data.length} of {totalCount} items
        </div>
      )}
    </>
  );
};

export default DataTable;