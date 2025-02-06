// components/Auth/EmailVerification.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/auth/verify-email`,
          {
            params: { token },
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setStatus("success");
        setMessage(response.data.message);
        setTimeout(() => navigate("/signin"), 3000);
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const statusIcons = {
    verifying: (
      <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ),
    success: (
      <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <img 
            src="/causebank.png" 
            alt="Logo" 
            className="h-24 w-auto mb-4"
          />

          {/* Status Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {statusIcons[status]}
          </motion.div>

          {/* Status Title */}
          <h2 className="text-2xl font-bold text-gray-900">
            {status === "verifying" && "Verifying Your Email"}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </h2>

          {/* Message */}
          <p className={`text-sm ${
            status === "success" ? "text-green-600" : 
            status === "error" ? "text-red-600" : 
            "text-gray-600"
          }`}>
            {message}
          </p>

          {/* Additional Info */}
          {status === "success" && (
            <p className="text-sm text-gray-500">
              Redirecting you to login page in a few seconds...
            </p>
          )}

          {/* Action Button */}
          {status === "error" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signin")}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-[#88aad8] to-[#3767a6] text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Go to Login
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Progress Bar for Success State */}
      {status === "success" && (
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 3 }}
          className="fixed bottom-0 left-0 h-1 bg-green-500"
          style={{ transformOrigin: "0% 50%" }}
        />
      )}
    </div>
  );
};

export default EmailVerification;