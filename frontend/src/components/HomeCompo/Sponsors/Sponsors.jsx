// components/Sponsors.jsx
import React from 'react';

const sponsors = [
  { id: 1, name: 'Sponsor 1', logo: '/Qatar_Airways.png' },
  { id: 3, name: 'Sponsor 3', logo: '/hubspot-logo.png' },
  { id: 4, name: 'Sponsor 4', logo: '/pearson-logo.png' },
  { id: 5, name: 'Sponsor 5', logo: '/Natgeologo.png' },
];

const Sponsors = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
          Our Trusted Partners
        </h2>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {[1, 2].map((set) => (
              <div 
                key={set} 
                className="flex items-center space-x-24 md:space-x-32 lg:space-x-40 mx-12 md:mx-16 lg:mx-20 shrink-0"
              >
                {sponsors.map((sponsor) => (
                  <div key={sponsor.id} className="w-[120px] md:w-[150px] lg:w-[180px] flex items-center justify-center">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="h-8 md:h-10 lg:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
