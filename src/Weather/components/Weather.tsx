import { useEffect, useState } from "react";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import Loader from "../../common/components/Loader";
import Dropdown from "../../common/components/Dropdown";
import { fetchWeather } from "../services";
import KeyValuePair from "../../common/components/KeyValuePair";
import { cities, weatherIcons } from "../constants";

interface City {
  name: string;
  temperature: number;
  feelsLike: number;
  low: number;
  high: number;
  humidity: number;
  description: string;
  weather: string;
  windSpeed: number;
  icon: string;
}

const Weather = () => {
  const [selectedCity, setSelectedCity] = useState<string>("Tokyo");
  const [citiesData, setCitiesData] = useState<City[]>([]);
  const [cityDetails, setCityDetails] = useState<City | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        windSpeed: Math.round(city.wind.speed),
        icon: city.weather[0].icon.slice(0, -1),
      }));

      setCitiesData(data);
    };

    setIsLoading(true);
    fetchData();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (citiesData.length > 0) {
      const data = citiesData.find((city) => city.name === selectedCity);
      setCityDetails(data);
    }
  }, [selectedCity, citiesData]);

  return (
    <div className="weather-container">
      <div className="weather-header">
        <BackToPlayboxButton color="purple" />
        <Dropdown
          items={cityMenuItems}
          selectedItem={selectedCity}
          setSelectedItem={setSelectedCity}
        />
        <div className="weather-search-input">
          <input />
        </div>
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
              <div className="city-detail-key-values">
                <KeyValuePair
                  keyString="Temperature"
                  value={`${cityDetails.temperature}`}
                />
                <KeyValuePair
                  keyString="Feels like"
                  value={`${cityDetails.feelsLike}`}
                />
                <KeyValuePair keyString="High" value={`${cityDetails.high}`} />
                <KeyValuePair keyString="Low" value={`${cityDetails.low}`} />
                <KeyValuePair
                  keyString="Humidity"
                  value={`${cityDetails.humidity}`}
                />
                <KeyValuePair
                  keyString="Wind speed"
                  value={`${cityDetails.windSpeed} mph`}
                />
              </div>
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
