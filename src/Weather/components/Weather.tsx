// weather detail (default city is NYC)
// display metadata key value pairs

// weather list (chips with current weather)
// display 20 default cities

// weather header
// back to playbox button
// dropdown select filter
// city search input with plus sign
// add cities
// delete cities

// dropdown
// props: array of strings
// states: selected
// display: button, menu (positioned absolute)
// menu item will have an onclick to set the selected item

import { useEffect, useState } from "react";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import Loader from "../../common/components/Loader";
import Dropdown from "../../common/components/Dropdown";
import { fetchWeather } from "../services";

interface City {
  name: string;
  temperature: number;
  feelsLike: number;
  low: number;
  high: number;
  humidity: number;
  description: string;
  weather: string;
}

const cities: string[] = [
  "New York City",
  "Shanghai",
  "Tokyo",
  "Paris",
  "London",
  "Hong Kong",
  "Los Angeles",
  "Dubai",
  "Boston",
  "Toronto",
];

const Weather = () => {
  const [selectedCity, setSelectedCity] = useState<string>("Tokyo");
  const [citiesData, setCitiesData] = useState<City[]>([]);

  const cityMenuItems = cities.map((city) => ({ name: city }));

  useEffect(() => {
    const fetchData = async () => {
      const fetchPromises = cities.map((city) => {
        const promise = fetchWeather(city);
        return promise;
      });

      const response = await Promise.all(fetchPromises);
      const data = response.map((city) => ({
        name: city.name,
        temperature: Math.round(city.main.temp),
        feelsLike: Math.round(city.main.feels_like),
        low: Math.round(city.main.temp_min),
        high: Math.round(city.main.temp_max),
        humidity: Math.round(city.main.humidity),
        description: city.weather[0].description,
        weather: city.weather[0].main,
      }));

      setCitiesData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="weather-container">
      <div className="weather-header">
        <BackToPlayboxButton color="purple" />
        <Dropdown
          items={cityMenuItems}
          selectedItem={selectedCity}
          setSelectedItem={setSelectedCity}
        />
      </div>
      <div className="weather-body">
        <div className="weather-detail">
          {citiesData.length > 0 ? (
            <div className="city-detail">{selectedCity}</div>
          ) : (
            <Loader />
          )}
        </div>
        <div className="weather-list"></div>
      </div>
    </div>
  );
};

export default Weather;
