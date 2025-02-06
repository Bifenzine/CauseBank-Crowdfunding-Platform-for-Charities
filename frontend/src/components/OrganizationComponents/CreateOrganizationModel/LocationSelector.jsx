// components/LocationSelector.jsx
import React from "react";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const LocationSelector = ({
  selectedCountry,
  selectedState,
  selectedCity,
  onCountryChange,
  onStateChange,
  onCityChange,
}) => {
  return (
    <div className="space-x-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-normal text-gray-700">
          Country
        </label>
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
          containerClassName="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-normal text-gray-700">
          State/Province
        </label>
        <StateSelect
          countryid={selectedCountry?.id}
          onChange={(state) => {
            onStateChange({
              name: state.name,
              isoCode: state.id,
              ...state,
            });
          }}
          placeHolder="Select State"
          value={selectedState?.id}
          containerClassName="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-normal text-gray-700">City</label>
        <CitySelect
          countryid={selectedCountry?.id}
          stateid={selectedState?.id}
          onChange={(city) => {
            onCityChange({
              name: city.name,
              id: city.id,
              ...city,
            });
          }}
          placeHolder="Select City"
          value={selectedCity?.id}
          containerClassName="mt-1"
        />
      </div>
    </div>
  );
};

export default LocationSelector;
