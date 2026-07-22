type WeatherUnit = "metric" | "imperial";

const getWeatherApiUrl = (city: string, unit?: WeatherUnit) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${
    unit || "imperial"
  }&appid=${apiKey}`;
};

export const fetchWeather = async (city: string, unit?: WeatherUnit) => {
  try {
    const url = getWeatherApiUrl(city, unit);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
