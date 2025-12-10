import React from "react";

const UserCard = ({ userInfo }) => {
  // Fallback for profile image
  const getProfileImageSrc = (imageUrl) => {
    // If imageUrl is null/empty, return a placeholder
    if (!imageUrl) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23888'%3ENo Image%3C/text%3E%3C/svg%3E";
    }
    return imageUrl;
  };

  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={getProfileImageSrc(userInfo?.profileImageUrl)}
            alt={"Avatar"}
            className="w-12 h-12 rounded-full border-2 border-white"
            onError={(e) => {
              // If the image fails to load, use a placeholder
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23888'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="">
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
      </div>
      <div className="flex items-end gap-3 mt-5">
        <StatCard
          label="Pending"
          count={userInfo?.pendingTasks || 0}
          status="Pending"
        />
        <StatCard
          label="In Progress"
          count={userInfo?.inProgressTasks || 0}
          status="In Progress"
        />
        <StatCard
          label="Completed"
          count={userInfo?.completedTasks || 0}
          status="Completed"
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label, count, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-gray-50";
      case "Completed":
        return "text-indigo-500 bg-gray-50";

      default:
        return "text-violet-500 bg-gray-50";
    }
  };
  return (
    <div
      className={`flex-1 text-[10px] font-medium ${getStatusColor()} px-4 py-0.5 rounded`}
    >
      <span className="text-[12px] font-semibold mr-1">{count}</span>
      {label}
    </div>
  );
};