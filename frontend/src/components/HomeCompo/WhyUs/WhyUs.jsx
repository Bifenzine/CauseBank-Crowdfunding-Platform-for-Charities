// components/AboutUs.jsx
import React from 'react';
import { motion } from 'framer-motion';

const WhyUs = () => {
  const stats = [
    { number: "10K+", label: "Active Donors" },
    { number: "$2M+", label: "Funds Raised" },
    { number: "50+", label: "Countries" },
    { number: "95%", label: "Success Rate" }
  ];

  const team = [
    {
      name: "okokokokokok",
      role: "Founder & CEO",
      image: "/okokokoko.jpg",
      bio: "Former humanitarian worker with 15 years of experience in global aid.",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "okokokok",
      role: "Head of Operations",
      image: "/okokokok.jpg",
      bio: "Expert in scaling nonprofit organizations and impact measurement.",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "okokokok",
      role: "Community Director",
      image: "/okokoko.jpg",
      bio: "Passionate about connecting donors with meaningful causes.",
      social: {
        twitter: "#",
        linkedin: "#"
      }
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh] min-h-[500px] bg-gradient-to-r from-[#3767a6] to-[#96b3d9]"
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Our Mission
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl max-w-3xl mx-auto"
            >
              Empowering communities through transparent and effective fundraising, 
              making a lasting impact on lives around the world.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-[#3767a6] mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Founded in 2020, our platform emerged from a simple yet powerful idea: 
                to create a transparent and efficient way for people to help others in need. 
                What started as a local initiative has grown into a global movement, 
                connecting donors with causes that matter.
              </p>
              <p className="text-gray-600">
                Today, we're proud to facilitate meaningful connections between donors 
                and causes, ensuring that every contribution makes a real difference 
                in someone's life.
              </p>
            </motion.div>
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <img 
                src="/gaza.jpg" 
                alt="Our Story" 
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                <p className="text-[#3767a6] font-semibold">3+ Years</p>
                <p className="text-gray-600">of Impact</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>



      {/* Values Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide our mission and shape our impact.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparency",
                description: "We believe in complete openness about how funds are used and their impact.",
                icon: "🔍"
              },
              {
                title: "Efficiency",
                description: "Maximizing the impact of every donation through smart resource allocation.",
                icon: "⚡"
              },
              {
                title: "Community",
                description: "Building strong connections between donors and beneficiaries.",
                icon: "🤝"
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * index }}
                className="bg-gray-50 rounded-xl p-8 text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-20 bg-gradient-to-r from-[#3767a6] to-[#96b3d9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to Make a Difference?
          </h2>
          <button className="bg-white text-[#3767a6] px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
            Join Our Mission
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default WhyUs;
