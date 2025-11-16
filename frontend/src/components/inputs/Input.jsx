import React from "react";
import { useState } from "react";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa6"

const Input = ({ value, onChange, placeholder, label, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
  return (
    <div>
      <label className=" text-[13px] text-shadow-slate-800">{label}</label>
      <div className="input-box">
        <input type={type=="password" ? showPassword ?"text" :"password" :type }
        placeholder={placeholder}
        className="w-full bg-transparent outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        />


        {type == "password" && (
          <>
          {showPassword ? (
            <FaRegEye size={22} onClick={toggleShowPassword} className="cursor-pointer text-primary"/>
          ) : (
            <FaRegEyeSlash size={22} onClick={toggleShowPassword} className="cursor-pointer text-slate-400"/>
          )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
