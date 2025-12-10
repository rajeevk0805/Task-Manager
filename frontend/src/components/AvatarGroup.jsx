import React from 'react'

const AvatarGroup = ({avatars,maxVisible}) => {
  // Fallback for profile image
  const getProfileImageSrc = (imageUrl) => {
    // If imageUrl is null/empty, return a placeholder
    if (!imageUrl) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23888'%3ENo Image%3C/text%3E%3C/svg%3E";
    }
    return imageUrl;
  };

  return (
    <div className="flex items-center">
        {avatars.slice(0, maxVisible).map((avatar, index) => (
          <img 
            key={index} 
            src={getProfileImageSrc(avatar)} 
            alt={`avatar ${index}`} 
            className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0" 
            onError={(e) => {
              // If the image fails to load, use a placeholder
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23888'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        ))}
        {avatars.length > maxVisible && (
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-gray-50 text-sm font-medium border-2 border-white -ml-3">
            +{avatars.length - maxVisible}
          </div>
        )}
    </div>
  )
}

export default AvatarGroup