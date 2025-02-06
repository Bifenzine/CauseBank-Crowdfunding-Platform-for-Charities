// useCauses.js
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../../Config/config.js";

const useCauses = (filters = {}, page = 0) => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});
  const cancelTokenRef = useRef();

  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 20,
  });

  const cleanParams = (params) => {
    const cleanedParams = { ...params };
    Object.keys(cleanedParams).forEach((key) => {
      if (
        cleanedParams[key] === null ||
        cleanedParams[key] === undefined ||
        cleanedParams[key] === ""
      ) {
        delete cleanedParams[key];
      }
    });
    return cleanedParams;
  };

  const fetchCauses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cancel previous request if exists
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }

      cancelTokenRef.current = axios.CancelToken.source();

      // Check cache
      const cacheKey = JSON.stringify({ filters, page });
      if (cache[cacheKey]) {
        setCauses(cache[cacheKey].causes);
        setPagination(cache[cacheKey].pagination);
        setLoading(false);
        return;
      }

      const params = cleanParams({
        page,
        size: pagination.pageSize,
        sortBy: "createdAt",
        sortDirection: "DESC",
        searchTerm: filters.searchTerm,
        status: filters.status,
        categoryId: filters.categoryId,
        organizationId: filters.organizationId,
        country: filters.country,
        isFeatured: filters.isFeatured,
        minAmount: filters.minAmount,
        maxAmount: filters.maxAmount,
        startDate: filters.startDate,
        endDate: filters.endDate,
        percentageToGoal: filters.percentageToGoal,
        daysToEnd: filters.daysToEnd,
      });

      const response = await axios.get(
        `${config.apiUrl}/api/v1/causes/featured/${params ? "search" : ""}`,
        {
          params,
          cancelToken: cancelTokenRef.current.token,
        }
      );

      const causesData = response.data.data;

      // Update cache
      setCache((prev) => ({
        ...prev,
        [cacheKey]: {
          causes: causesData.content,
          pagination: {
            currentPage: causesData.number,
            totalPages: causesData.totalPages,
            totalElements: causesData.totalElements,
            pageSize: causesData.size,
          },
        },
      }));

      setCauses(causesData.content);
      setPagination({
        currentPage: causesData.number,
        totalPages: causesData.totalPages,
        totalElements: causesData.totalElements,
        pageSize: causesData.size,
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(err.response?.data?.message || "Failed to load causes");
        console.error("Error fetching causes:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCauses();
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    };
  }, [page, JSON.stringify(filters)]);

  return {
    causes,
    loading,
    error,
    pagination,
    refetch: fetchCauses,
  };
};

export default useCauses;
