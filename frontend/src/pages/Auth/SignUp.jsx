import React, { useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useState } from "react";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/useContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

   const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  //handle SignUp
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter full name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");

    //SignUp API Call

    try {
      //upload image if present
      if(profilePic){
        try {
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.imageUrl || "";
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError.message);
          setError(uploadError.message || "Failed to upload profile image");
          return;
        }
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name:fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });
      const {token,role}=response.data;
     if(token){
      localStorage.setItem("token", token);
      updateUser(response.data);
     }

     //Redirect based on role
     if(role==="admin"){
       navigate("/admin/dashboard");
     }else{
       navigate("/user/dashboard");
     }

    } catch (error) {
      // Improved error handling
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Something went wrong, please try again later.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={(value) => setFullName(value)}
              placeholder="John"
              label="Full Name"
              type="text"
            />
            <Input
              value={email}
              onChange={(value) => setEmail(value)}
              placeholder="john@example.com"
              label="Email"
              type="text"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              value={password}
              onChange={(value) => setPassword(value)}
              placeholder="Enter your password"
              label="Password"
              type="password"
            />
            <Input
              value={adminInviteToken}
              onChange={(value) => setAdminInviteToken(value)}
              placeholder="6 Digit Code"
              label="Admin Invite Token"
              type="text"
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className=" btn-primary">
            Sign Up
          </button>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
