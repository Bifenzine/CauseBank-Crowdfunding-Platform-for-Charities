// components/HowItWorks.jsx

import { motion } from 'framer-motion';
import {Link} from "react-router-dom";

const steps = [
  {
    id: 1,
    title: "Create Your Campaign",
    description: "Set up your fundraising campaign in minutes. Add your story, photos and fundraising goal to get started.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    )
  },
  {
    id: 2, 
    title: "Share Your Story",
    description: "Share your campaign with friends and family through social media , email, or text message to raise awareness.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Collect Donations",
    description: "Receive donations directly to your account. Track progress and thank your donors for support.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

const HowItWorks = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-base font-semibold text-[#3767a6] tracking-wide uppercase">
            Simple Process
          </h2>
          <p className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
            How It Works
          </p>
          <p className="mt-4 text-xl text-gray-500">
            Start your fundraising journey in three simple steps
          </p>
        </motion.div>

        {/* Steps Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-8 relative"
        >
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#3767a6] to-[#96b3d9] transform -translate-y-1/2" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Step Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative z-10">
                {/* Step Number */}
                <div className="absolute -top-4 left-8 bg-[#3767a6] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {step.id}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 bg-[#3767a6]/10 rounded-full flex items-center justify-center text-[#3767a6] mb-6">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>

                {/* Learn More Link */}
                <a 
                  href="/Fullhowitworks" 
                  className="inline-flex items-center mt-6 text-[#3767a6] font-medium hover:text-[#96b3d9] transition-colors duration-200"
                >
                  Learn more
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-[#3767a6] to-[#96b3d9] rounded-2xl p-12 shadow-xl">
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to Start Your Campaign?
            </h3>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of successful fundraisers who have made a difference in their communities.
            </p>
            <Link to={"/Causes"}>

            <button className="bg-white text-[#3767a6] px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              Start Fundraising Now
            </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;
