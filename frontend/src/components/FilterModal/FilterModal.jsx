// FilterModal.jsx
import React, {useState, useCallback, useEffect} from "react";
import { FaTimes } from "react-icons/fa";
import debounce from "lodash/debounce";
import "react-datepicker/dist/react-datepicker.css";
import {getAllStatus} from "../../DataFetching/DataFetching.js";
import StatusSelector from "../CausesComponents/StatusSelector/StatusSelector.jsx";

const FilterModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  categories,
  countries,
}) => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "",
    categoryId: "",
    organizationId: "",
    country: "",
    isFeatured: true,
    minAmount: "",
    maxAmount: "",
    startDate: null,
    endDate: null,
    percentageToGoal: false,
    daysToEnd: false,
  });

  const [errors, setErrors] = useState({});
  const [causeStatus, setCausesStatus] = useState(null);

  useEffect(() => {
    getAllStatus().then((response) => {
      setCausesStatus(response?.data);
      console.log("status", response?.data);
    }).catch(
        console.log("error")
    )
  }, []);

  const handleStatusChange = (status) => {
    setFilters(prev => ({
      ...prev,
      status
    }));
    console.log(status);
  };

  const validateForm = () => {
    const newErrors = {};

    if (filters.minAmount && filters.maxAmount) {
      if (Number(filters.minAmount) > Number(filters.maxAmount)) {
        newErrors.amount =
          "Minimum amount cannot be greater than maximum amount";
      }
    }

    if (filters.startDate && filters.endDate) {
      if (filters.startDate > filters.endDate) {
        newErrors.dates = "Start date cannot be after end date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      status: "",
      categoryId: "",
      organizationId: "",
      country: "",
      isFeatured: true,
      minAmount: "",
      maxAmount: "",
      startDate: null,
      endDate: null,
      percentageToGoal: false,
      daysToEnd: false,
    });
    setErrors({});
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, searchTerm: value }));
    }, 500),
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedFilters = {
      ...filters,
      startDate: filters.startDate ? filters.startDate.toISOString() : null,
      endDate: filters.endDate ? filters.endDate.toISOString() : null,
      minAmount: filters.minAmount ? parseFloat(filters.minAmount) : null,
      maxAmount: filters.maxAmount ? parseFloat(filters.maxAmount) : null,
      percentageToGoal: filters.percentageToGoal ? 80 : null,
      daysToEnd: filters.daysToEnd ? 7 : null,
      status: filters.status ? filters.status : null
    };

    // Remove null/empty values
    Object.keys(formattedFilters).forEach((key) => {
      if (formattedFilters[key] === null || formattedFilters[key] === "") {
        delete formattedFilters[key];
      }
    });

    onApplyFilters(formattedFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter Causes</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search Term
            </label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search causes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={filters.categoryId}
                onChange={(e) =>
                  setFilters({ ...filters, categoryId: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                value={filters.country}
                onChange={(e) =>
                  setFilters({ ...filters, country: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isFeatured}
              onChange={(e) =>
                setFilters({ ...filters, isFeatured: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Featured Causes Only
            </label>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Min Amount
              </label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) =>
                  setFilters({ ...filters, minAmount: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Min"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Max Amount
              </label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) =>
                  setFilters({ ...filters, maxAmount: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Status
              </label>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    ...filters,
                    percentageToGoal: !filters.percentageToGoal,
                  })
                }
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filters.percentageToGoal
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                Near Goal
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Status
              </label>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    ...filters,
                    daysToEnd: !filters.daysToEnd,
                  })
                }
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filters.daysToEnd
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                Ending Soon
              </button>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
              <StatusSelector
                  selectedStatus={filters?.status}
                  onStatusChange={handleStatusChange}
                  statusOptions={causeStatus}
              />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;
