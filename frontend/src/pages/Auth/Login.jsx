import React from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useContext } from "react";
import { UserContext } from "../../context/useContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  //handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");
    setLoading(true);

    //Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      if (response.data && response.data.token) {
        // Update user context with the response data
        updateUser(response.data);
        // Redirect based on user role
        if (response.data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred during login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-gray-500 mt-[5px] mb-6">
          Please enter your details to login
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(value) => setEmail(value)}
            placeholder="john@example.com"
            label="Email"
            type="text"
          />

          <Input
            value={password}
            onChange={(value) => setPassword(value)}
            placeholder="Enter your password"
            label="Password"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;