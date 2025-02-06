// components/Hero.jsx
import React from "react";
import { motion } from "framer-motion"; // You'll need to install framer-motion
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-10 sm:py-6 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4">
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[#3767a6] font-semibold tracking-wider uppercase">
                Make a Difference Today
              </motion.span>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Together We Can
                <span className="block pb-3 bg-gradient-to-r from-[#3767a6] to-[#96b3d9] text-transparent bg-clip-text">
                  Change Lives
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-lg text-gray-600 max-w-xl">
                Join our global community of changemakers and help create
                lasting impact for those in need. Every donation makes a
                difference.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4">
              <Link to={"/Causes"}>
              <button className="px-8 py-4 bg-gradient-to-r from-[#3767a6] to-[#96b3d9] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Start Fundraising
              </button>
              </Link>
              <Link to="/WhyUs">
                <button className="px-8 py-4 bg-white text-[#3767a6] border-2 border-[#3767a6] rounded-xl font-semibold hover:bg-gray-50 transform hover:-translate-y-0.5 transition-all duration-200">
                  Learn More
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#3767a6]">10K+</div>
                <div className="text-sm text-gray-600">Donors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#3767a6]">$2M+</div>
                <div className="text-sm text-gray-600">Raised</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#3767a6]">50+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/gazahelping.jpg"
                alt="Helping hands"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl max-w-xs">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#3767a6]/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#3767a6]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Campaign</p>
                  <p className="font-semibold">Emergency Relief</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#3767a6] h-2 rounded-full"
                  style={{ width: "70%" }}></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-600">$145,000 raised</span>
                <span className="text-[#3767a6] font-semibold">70%</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
