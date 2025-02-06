// src/pages/NotFound.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 2 + 2
  }));

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center relative overflow-hidden px-4 py-8 sm:py-12">
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-blue-200 rounded-full opacity-30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Main content */}
      <div className="text-center z-10 w-full max-w-3xl mx-auto">
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3767a6] to-[#96b3d9]">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 px-4 sm:px-6"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            The page you're looking for seems to have vanished into thin air!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 sm:mt-8 space-y-4 px-4 sm:px-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#3767a6] to-[#96b3d9] text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base"
            >
              Return Home
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-white text-gray-700 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow border border-gray-200 text-sm sm:text-base"
            >
              Go Back
            </motion.button>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mt-4">
            Redirecting to home in {countdown} seconds...
          </p>
        </motion.div>

        {/* Search suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 sm:mt-12 mx-4 sm:mx-auto max-w-md"
        >
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Try searching instead?</h3>
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3767a6] text-sm sm:text-base"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-[#3767a6] to-[#96b3d9] text-white rounded-lg text-sm sm:text-base whitespace-nowrap flex-shrink-0"
                >
                  Search
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 sm:mt-12 text-xs sm:text-sm text-gray-500 px-4 sm:px-6"
        >
          <p>Your gift today can bring shelter, food, and hope to families devastated by war.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
