import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ExternalLink, AlertCircle } from "lucide-react";
import { getBookmarkedCauses } from "../../../DataFetching/DataFetching";
import CauseCard from "../../../components/CausesComponents/CauseCard";
import {useBookmarkContext} from "../../../Context/BookmarkContext.jsx";

// eslint-disable-next-line react/prop-types
const BookmarksSection = ({ userId }) => {
  const {bookmarkedCauses,fetchBookmarkedCauses} = useBookmarkContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
fetchBookmarkedCauses();
    setLoading(false);
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (bookmarkedCauses?.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Bookmark className="h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">
            No bookmarks yet
          </h3>
          <p className="text-gray-600">
            You haven&#39;t bookmarked any causes yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
      {bookmarkedCauses?.map((cause) => (

          <CauseCard key={cause?.id}
            causeId={cause?.causeId}
            causeFeaturedImageUrl={cause?.featuredImageUrl}
            causeTitle={cause?.title}
            causeDescription={cause?.description}
            causeCategory={cause?.causeCategory}
            causeCountry={cause?.causeCountry}
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
  );
};

export default BookmarksSection;
