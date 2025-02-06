import { useRef, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";

const ImagePicker = ({
  onImagesSelect,
  selectedImages = [],
  isFeatured = false,
  maxFiles = 6,
  label = "Upload Images",
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (isFeatured && files.length > 0) {
      const file = files[0];
      onImagesSelect({
        url: URL.createObjectURL(file),
        file: file,
      });
      return;
    }

    const totalFiles = selectedImages.length + files.length;
    if (totalFiles > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`);
      return;
    }

    const newFiles = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
    }));

    onImagesSelect([...selectedImages, ...newFiles]);
  };

  const handleRemoveImage = (indexToRemove) => {
    if (isFeatured) {
      onImagesSelect(null);
    } else {
      const newImages = selectedImages.filter(
        (_, index) => index !== indexToRemove
      );
      onImagesSelect(newImages);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label} {!isFeatured && `(Max ${maxFiles})`}
      </label>

      <div
        className={`grid ${
          isFeatured ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"
        } gap-4`}>
        {isFeatured
          ? selectedImages && (
              <div className="relative group">
                <div className="relative aspect-video">
                  <img
                    src={selectedImages.url}
                    alt="Featured"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(0)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          : selectedImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-video">
                  <img
                    src={image.url}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

        {(isFeatured ? !selectedImages : selectedImages.length < maxFiles) && (
          <button
            type="button"
            onClick={handleClick}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors aspect-video">
            <FiUpload className="w-8 h-8 mb-2" />
            <span className="text-sm text-center">
              Click to upload
              {!isFeatured &&
                selectedImages.length > 0 &&
                ` (${maxFiles - selectedImages.length} remaining)`}
            </span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple={!isFeatured}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Supported formats: JPG, PNG, GIF (max 5MB each)
      </p>
    </div>
  );
};

export default ImagePicker;
