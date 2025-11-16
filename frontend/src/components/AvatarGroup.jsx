import React from 'react'

const AvatarGroup = ({avatars,maxVisible}) => {
  return (
    <div className="flex items-center">
        {avatars.slice(0, maxVisible).map((avatar, index) => (
          <img key={index} src={avatar} alt={`avatar ${index}`} className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0" />
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