import React from "react";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, placeholder, label, type, id, autoComplete, className }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
    
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className={`relative rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600 ${className || ''}`}>
        <input 
          type={type === "password" ? showPassword ? "text" : "password" : type}
          id={id}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <FaRegEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            ) : (
              <FaRegEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;