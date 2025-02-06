import { useEffect, useState } from "react";
import ForumApi, { getAllCategories } from "../../DataFetching/DataFetching";

const useCategrories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useCategrories;
