// components/Auth/SignIn.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useLogin from "../../Hooks/AuthHooks/useLogin";
import useGoogle from "../../Hooks/AuthHooks/useGoogle";
import { toast } from 'react-hot-toast';

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isLoading } = useLogin();
  const { googleOauth } = useGoogle();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Section - Sign In Form */}
      <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-12 lg:p-16">
        <div className="max-w-md mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#333333] mb-2">
              Welcome back to CauseBank
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Sign in to continue your journey of making a difference
            </p>
          </div>

          {/* Sign In Form */}
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              {/* google btn */}
              <button
                onClick={googleOauth}
                type="button"
                className="w-full flex items-center justify-center gap-2 mb-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
                <span className="text-[#333333]">Sign in with Google</span>
              </button>

              <label className="block text-sm font-medium text-[#333333] mb-1.5 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3767a6] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3767a6] focus:border-transparent outline-none transition-all text-sm sm:text-base pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#3767a6] focus:ring-[#3767a6] border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-[#3767a6] hover:underline">
                Forgot password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#96b3d9] to-[#3767a6] text-white py-2.5 sm:py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 text-sm sm:text-base shadow-md"
              type="submit"
              disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <span className="text-gray-600 text-sm sm:text-base">
              Don't have an account?{" "}
            </span>
            <Link
              to="/signupType"
              className="text-[#3767a6] font-medium hover:underline text-sm sm:text-base">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section - Feature Highlights */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#96b3d9] to-[#3767a6] p-8 lg:p-12 items-center justify-center">
        <div className="max-w-md text-white">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
            Join the Movement
          </h2>
          <p className="mb-6 lg:mb-8 text-sm lg:text-base">
            CauseBank connects passionate individuals with meaningful causes.
            Together, we can create lasting change in our communities.
          </p>

          <div className="space-y-3 lg:space-y-4">
            {[
              "Secure and transparent donations",
              "Real-time impact tracking",
              "Community of changemakers",
              "24/7 dedicated support",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 lg:gap-3">
                <svg
                  className="w-4 h-4 lg:w-5 lg:h-5 text-white flex-shrink-0"
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
                <span className="text-sm lg:text-base">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 lg:mt-12">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-white/20 border-2 border-white"
                  />
                ))}
              </div>
              <p className="text-xs lg:text-sm">
                Join thousands of donors making a difference
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
