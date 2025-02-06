// components/CountrySelector.jsx
import React from "react";
import { CountrySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const CountrySelector = ({ selectedCountry, onCountryChange }) => {
  return (
    <div>
      <label className="block text-sm font-normal text-gray-700">Country</label>
      <CountrySelect
        onChange={(country) => {
          onCountryChange({
            name: country.name,
            isoCode: country.id,
            ...country,
          });
        }}
        placeHolder="Select Country"
        value={selectedCountry?.id}
        containerClassName="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  );
};

export default CountrySelector;
