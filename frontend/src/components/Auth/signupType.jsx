// SignupType.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSignup from "../../Hooks/AuthHooks/useSignup";
import axios from "axios";
import toast from "react-hot-toast"; // Import toast
import useGoogle from "../../Hooks/AuthHooks/useGoogle";

const SignupType = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const { signup, loading } = useSignup();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await signup(formData);
    }
  };

  const { googleOauth } = useGoogle();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 p-4 md:p-8 bg-white">
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-2 text-[#333333]">
            Create Your Account
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Join our community and start making a difference
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            {/* google btn */}
            <button
              onClick={googleOauth}
              type="button"
              className="w-full flex items-center justify-center gap-2 mb-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
              <span className="text-[#333333]">Sign in with Google</span>
            </button>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-[#3767a6] focus:border-[#3767a6] ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-[#3767a6] focus:border-[#3767a6] ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Create a password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-[#3767a6] focus:border-[#3767a6] ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-[#3767a6] focus:border-[#3767a6] ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Role
            </label>
            <select
              name="role"
              disabled
              value={formData.role}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#3767a6] focus:border-[#3767a6]">
              <option value="DONOR">Donor</option>
            </select>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-[#3767a6] focus:border-[#3767a6] ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3767a6] text-white py-2 rounded-lg hover:bg-[#2a4d7d] transition-colors duration-300 disabled:bg-gray-400">
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Submit Error Message */}
          {errors.submit && (
            <p className="text-red-500 text-sm text-center mt-2">
              {errors.submit}
            </p>
          )}
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to="/signin"
            className="text-[#3767a6] hover:text-[#96b3d9] font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#96b3d9] to-[#3767a6] p-12 items-center justify-center text-white">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            Empower Change Through Giving
          </h1>
          <p className="mb-8 text-white/90">
            Join a community dedicated to making the world better. Our platform
            provides the tools and support you need to create meaningful impact.
          </p>

          <div className="space-y-6">
            {[
              "Secure & Transparent Donations",
              "Powerful Campaign Management",
              "Dedicated Support & Resources",
              "Real-time Analytics & Insights",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-full">
                  <svg
                    className="w-5 h-5 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupType;
