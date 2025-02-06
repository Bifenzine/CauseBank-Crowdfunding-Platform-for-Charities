import {useEffect, useState} from "react";
import { FaFilter, FaSpinner, FaSearch } from "react-icons/fa";
import CauseCard from "../../components/CausesComponents/CauseCard";
import useCauses from "../../Hooks/CauseHooks/useCauses";
import FilterModal from "../../components/FilterModal/FilterModal";
import useCategrories from "../../Hooks/CatgoriesHooks/useCategories";
import {getAllCountries} from "../../DataFetching/DataFetching.js";

const Causes = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { causes, loading, error, pagination } = useCauses(
    { ...filters, searchTerm },
    currentPage
  );
  const { categories} = useCategrories();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getAllCountries();
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // const countries = causes
  //   .map((cause) => cause?.country)
  //   .filter(
  //     (country, index, self) =>
  //       self.indexOf(country) === index && country !== null
  //   );

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when applying new filters
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  console.log("causes", causes);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#3767a6] to-[#96b3d9] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Make a Difference Today
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Support causes that matter and help create positive change in the
            world.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search causes by title..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 min-w-[140px]">
            <FaFilter />
            More Filters
          </button>
        </div>

        {/* Active Filters Display */}
        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).map(([key, value]) => {
              if (value && value !== "all") {
                return (
                  <span
                    key={key}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {key}: {value.toString()}
                  </span>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Showing {causes.length} of {pagination.totalElements} causes
        </p>

        {/* Causes Grid with Local Loading State */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
              <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500">
                <p className="text-xl font-semibold mb-2">
                  Error Loading Causes
                </p>
                <p>{error}</p>
              </div>
            </div>
          ) : causes?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No causes found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {causes?.map((cause) => (
                <CauseCard
                  key={cause.id}
                  causeId={cause?.id}
                  causeFeaturedImageUrl={cause?.featuredImageUrl}
                  causeTitle={cause?.title}
                  causeDescription={cause?.description}
                  causeCategory={cause?.category}
                  causeCountry={cause?.country}
                  causeGoalAmount={cause?.goalAmount}
                  causeCurrentAmount={cause?.currentAmount}
                  causeOrganization={cause?.organization}
                  causeDonorCount={cause?.donorCount}
                  causeViewCount={cause?.viewCount}
                  causeEndDate={cause?.endDate}
                  causeStatus={cause?.status}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-4 py-2 rounded ${
                  currentPage === i
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Filter Modal */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
          categories={categories}
          countries={countries}
        />
      </div>
    </div>
  );
};

export default Causes;
