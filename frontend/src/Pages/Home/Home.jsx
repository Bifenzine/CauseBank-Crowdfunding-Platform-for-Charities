// pages/Home.jsx
import React from "react";
import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";
import HeroSection from "../../components/HomeCompo/HeroSection/HeroSection";
import Sponsors from "../../components/HomeCompo/Sponsors/Sponsors";
import HowItWorks from "../../components/HomeCompo/HowItWork/HowItWork";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Your main content will go here */}
        <HeroSection />
        <Sponsors />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
