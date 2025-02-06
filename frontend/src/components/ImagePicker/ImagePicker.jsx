// components/common/ImagePicker.jsx
import React, { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { BsImage } from "react-icons/bs";

const ImagePicker = ({ onImageSelect, acceptedFileTypes = "" }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onImageSelect?.(file);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageSelect?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="relative">
        {!preview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-emerald-500 transition-colors cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-1">
              <BsImage className="w-4 h-4 text-gray-400" />
              <div className="text-xs text-gray-600">
                <span className="text-emerald-600 font-medium">
                  Click to upload
                </span>
              </div>
              <p className="text-xs text-gray-500">
                SVG, PNG, JPG, GIF (max. 10MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
              {preview.startsWith("data:video") ? (
                <video
                  src={preview}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          accept=".png, .jpg, .jpeg,.avif,.webp,.svg, .gif, .mp4"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImagePicker;
