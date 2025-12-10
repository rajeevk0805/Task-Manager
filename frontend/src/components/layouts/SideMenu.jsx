import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/useContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";

// Icon component to render dynamic icons
const Icon = ({ icon: IconComponent, className }) => {
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "/logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };
  
  const handleLogout = () => {
    clearUser();
    // Force a full page refresh to ensure clean state
    window.location.href = "/login";
  };

  useEffect(() => {
    if(user){
      setSideMenuData(user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
  }, [user]);

  // Don't render if user is not loaded yet
  if (!user) {
    return null;
  }

  // Fallback for profile image
  const getProfileImageSrc = (imageUrl) => {
    // If imageUrl is null/empty, return a placeholder
    if (!imageUrl) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23888'%3ENo Image%3C/text%3E%3C/svg%3E";
    }
    return imageUrl;
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20 overflow-y-auto">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img 
            src={getProfileImageSrc(user?.profileImageUrl)} 
            alt="Profile Image" 
            className="w-20 h-20 bg-slate-400 rounded-full object-cover border-4 border-blue-100"
            onError={(e) => {
              // If the image fails to load, use a placeholder
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23888'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
        <div className="text-center mt-3">
          {user?.role==="admin" && (
            <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded-full inline-block mb-1">
              Admin
            </div>
          )}
          <p className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">{user?.email}</p>
        </div>
      </div>

      <div className="px-2 pb-4">
        {sideMenuData.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item.path)}
            className={`menu-item ${
              activeMenu === item.name ? "active" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-primary">
                <Icon icon={item.icon} className="w-5 h-5" />
              </div>
              <span className="text-sm">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-4 pt-4 border-t border-gray-200/50 mt-auto">
        <div className="text-xs text-gray-500 text-center py-4">
          © {new Date().getFullYear()} Task Manager
        </div>
      </div>
    </div>
  );
};

export default SideMenu;