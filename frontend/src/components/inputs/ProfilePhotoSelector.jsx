import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      //update the image State
      setImage(file);

      //Generate preview URL from the file
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Photo
      </label>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {!image ? (
        <div className="w-24 h-24 flex items-center justify-center bg-blue-50 rounded-full border-2 border-dashed border-blue-200 relative cursor-pointer hover:bg-blue-100 transition-colors duration-200">
          <LuUser className="text-3xl text-blue-500" />
          <button 
            type="button" 
            onClick={onChooseFile}
            className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full absolute -bottom-2 -right-2 cursor-pointer hover:bg-blue-600 transition-colors duration-200 shadow-md"
          >
            <LuUpload className="text-sm" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-200">
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            type="button" 
            onClick={handleRemoveImage}
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-2 -right-2 cursor-pointer hover:bg-red-600 transition-colors duration-200 shadow-md"
          >
            <LuTrash className="text-sm" />
          </button>
        </div>
      )}
      <p className="mt-2 text-xs text-gray-500">
        JPG, PNG or GIF (Max 5MB)
      </p>
    </div>
  );
};

export default ProfilePhotoSelector;