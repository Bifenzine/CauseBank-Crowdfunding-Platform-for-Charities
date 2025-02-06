// components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-[#ffffff] text-2xl font-bold"> CauseBank</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Dedicated to Kindness & Help
              <br />
              Support For Our Communities
            </p>
          </div>

          {/* Donate Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Donate</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/education">Education</Link></li>
              <li><Link to="/social">Social</Link></li>
              <li><Link to="/medical">Medical</Link></li>
              <li><Link to="/disaster">Disaster</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  {/* Add Instagram SVG */}
                </svg>
              </a>
              {/* Add other social media icons */}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© Causebank, 2024. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;