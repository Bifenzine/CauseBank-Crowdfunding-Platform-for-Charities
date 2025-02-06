import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCauseMedia } from "../../DataFetching/DataFetching";

const CauseMedia = () => {
  const { id } = useParams();
  const [causeMedia, setCauseMedia] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchCauseMedia = async () => {
    try {
      const response = await getCauseMedia(id);
      setCauseMedia(response.data.data);
    } catch (err) {
      setError("Error loading cause media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCauseMedia();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {causeMedia?.map((media) => {
        const isVideo =
          media.mediaUrl.endsWith(".mp4") || media.mediaUrl.endsWith(".webm");

        // console.log("Media Item:", media); // Debugging log

        return (
          <div
            key={media.id}
            className="relative overflow-hidden rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
            {isVideo ? (
              <video
                src={media.mediaUrl}
                controls
                onError={() =>
                  console.error("Video failed to load:", media.mediaUrl)
                }
                className="w-full h-64 object-cover rounded-lg">
                <p>Video not supported or failed to load.</p>
              </video>
            ) : (
              <img
                src={media.mediaUrl}
                alt="Cause Media"
                onError={() =>
                  console.error("Image failed to load:", media.mediaUrl)
                }
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CauseMedia;
