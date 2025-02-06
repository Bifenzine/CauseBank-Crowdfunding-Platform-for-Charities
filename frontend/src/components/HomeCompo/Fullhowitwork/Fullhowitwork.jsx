// pages/how-it-works.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { 
  FaSearch, 
  FaHandHoldingHeart, 
  FaDonate, 
  FaRegSmile,
  FaShieldAlt,
  FaRegCreditCard,
  FaChartLine,
  FaUsers,
  FaRegQuestionCircle
} from 'react-icons/fa';

const HowItWorks = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);

  // Handle scroll for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'donation-process', label: 'Donation Process' },
    { id: 'impact', label: 'Your Impact' },
    { id: 'security', label: 'Security' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] bg-gradient-to-r from-[#3767a6] to-[#96b3d9]">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Understanding Our Platform
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl max-w-2xl mx-auto"
            >
              Learn how we connect donors with meaningful causes
            </motion.p>
          </div>
        </div>
      </section>

      {/* Navigation Bar */}
      <nav className={`bg-white border-b ${
        isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <ScrollLink
                key={item.id}
                to={item.id}
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                onSetActive={() => setActiveSection(item.id)}
                className={`px-6 py-4 cursor-pointer whitespace-nowrap ${
                  activeSection === item.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </ScrollLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Overview Section */}
        <section id="overview" className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaUsers,
                title: "Connect with Causes",
                description: "Browse and discover verified charitable organizations and causes that align with your values."
              },
              {
                icon: FaHandHoldingHeart,
                title: "Make a Difference",
                description: "Contribute to causes you care about and track the impact of your donations in real-time."
              },
              {
                icon: FaChartLine,
                title: "Track Progress",
                description: "Monitor how your contributions are making a difference with detailed impact reports."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <item.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Donation Process Section */}
        <section id="donation-process" className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Donation Process</h2>
          <div className="space-y-8">
            {[
              {
                icon: FaSearch,
                title: "1. Find Your Cause",
                description: "Search through our database of verified causes or use our smart matching system."
              },
              {
                icon: FaRegCreditCard,
                title: "2. Choose Donation Method",
                description: "Select your preferred payment method and donation frequency."
              },
              {
                icon: FaDonate,
                title: "3. Make Your Contribution",
                description: "Complete your secure donation with just a few clicks."
              },
              {
                icon: FaRegSmile,
                title: "4. Track Your Impact",
                description: "Receive regular updates about how your donation is making a difference."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start space-x-6 bg-white p-6 rounded-xl shadow-lg"
              >
                <step.icon className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Your Impact</h2>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { value: "100%", label: "Donation Transparency" },
                { value: "50K+", label: "Lives Impacted" },
                { value: "95%", label: "Donor Satisfaction" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Security & Trust</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <FaShieldAlt className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                All donations are processed using bank-level encryption and security measures.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <FaRegQuestionCircle className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Verified Organizations</h3>
              <p className="text-gray-600">
                We thoroughly vet all organizations to ensure your donations go to legitimate causes.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-20">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "How do I know my donation is secure?",
                answer: "We use industry-standard encryption and security measures to protect all transactions."
              },
              {
                question: "Can I get a tax receipt for my donation?",
                answer: "Yes, tax receipts are automatically generated and emailed for all eligible donations."
              },
              {
                question: "How are organizations verified?",
                answer: "We conduct thorough background checks and require proper documentation from all organizations."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#3767a6] to-[#96b3d9] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of donors who are creating positive change around the world
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
            onClick={() => window.location.href = '/causes'}
          >
            Start Donating
          </motion.button>
        </div>
      </section>
    </div>
    
  );
};

export default HowItWorks;
