import {
  type KeyboardEvent,
  type ChangeEvent,
  useEffect,
  useState,
} from "react";
import { type City, cities, weatherIcons } from "../constants";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import Loader from "../../common/components/Loader";
import Dropdown from "../../common/components/Dropdown";
import { fetchWeather } from "../services";
import CityDetails from "./CityDetails";
import CitySearchInput from "./CitySearchInput";

const Weather = () => {
  const [selectedCity, setSelectedCity] = useState<string>("Tokyo");
  const [citiesData, setCitiesData] = useState<City[]>([]);
  const [cityDetails, setCityDetails] = useState<City | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cityInput, setCityInput] = useState<string>("");
  const [citySearchError, setCitySearchError] = useState<boolean>(false);

  const cityMenuItems = cities.map((city) => ({ name: city }));

  useEffect(() => {
    const fetchCitiesData = async () => {
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
        windSpeed: Math.round(city.wind.speed),
        icon: city.weather[0].icon.slice(0, -1),
      }));

      setCitiesData(data);
    };

    try {
      setIsLoading(true);
      fetchCitiesData();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (citiesData.length > 0) {
      const data = citiesData.find((city) => city.name === selectedCity);
      setCityDetails(data);
    }
  }, [selectedCity, citiesData]);

  const handleSearchCity = async () => {
    if (cityInput.trim()) {
      try {
        const city = await fetchWeather(cityInput);
        const data = {
          name: city.name,
          temperature: Math.round(city.main.temp),
          feelsLike: Math.round(city.main.feels_like),
          low: Math.round(city.main.temp_min),
          high: Math.round(city.main.temp_max),
          humidity: Math.round(city.main.humidity),
          description: city.weather[0].description,
          weather: city.weather[0].main,
          windSpeed: Math.round(city.wind.speed),
          icon: city.weather[0].icon.slice(0, -1),
        };
        setCitiesData([...citiesData, data]);
        setSelectedCity(data.name);
        setCityInput("");
        setCitySearchError(false);
      } catch (error) {
        setCitySearchError(true);
      }
    }
  };

  const handleCityInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCityInput(event.target.value);
    if (!event.target.value) {
      setCitySearchError(false);
    }
  };

  const handleSearchCityOnKeyPress = async (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchCity();
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-header">
        <BackToPlayboxButton color="purple" />
        <Dropdown
          items={cityMenuItems}
          selectedItem={selectedCity}
          setSelectedItem={setSelectedCity}
        />
        <CitySearchInput
          cityInput={cityInput}
          handleCityInputChange={handleCityInputChange}
          handleSearchCityOnKeyPress={handleSearchCityOnKeyPress}
          handleSearchCity={handleSearchCity}
          error={citySearchError}
        />
      </div>
      <div className="weather-body">
        <div className="weather-detail">
          {isLoading ? (
            <Loader />
          ) : cityDetails ? (
            <div className="city-detail">
              <div className="city-detail-weather">
                <div className="city-detail-weather-icon">
                  {weatherIcons[cityDetails.icon]}
                </div>
                <div className="city-detail-description">
                  {cityDetails.description}
                </div>
              </div>
              <CityDetails cityDetails={cityDetails} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
