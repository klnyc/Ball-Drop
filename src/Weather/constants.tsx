import { type JSX } from "react";
import {
  CloudyIcon,
  SunIcon,
  CloudSunIcon,
  CloudRainIcon,
  CloudLightningIcon,
  CloudSnowIcon,
  CloudFog,
} from "lucide-react";

export interface City {
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

export const cities: string[] = [
  "New York",
  "Shanghai",
  "Tokyo",
  "Osaka",
  "Paris",
  "London",
  "Hong Kong",
  "Los Angeles",
  "San Francisco",
  "Dubai",
  "Boston",
  "Toronto",
  "Vancouver",
  "Seoul",
  "Denver",
  "Austin",
  "Dallas",
  "Berlin",
  "Madrid",
  "Rome",
  "Amsterdam",
  "Vienna",
  "Prague",
  "Budapest",
  "Warsaw",
  "Dublin",
  "Lisbon",
  "Brussels",
  "Copenhagen",
  "Stockholm",
  "Oslo",
  "Helsinki",
  "Athens",
  "Zurich",
  "Barcelona",
];

export const weatherIcons: { [code: string]: JSX.Element } = {
  "01": <SunIcon size={72} />, // clear sky
  "02": <CloudSunIcon size={72} />, // few clouds
  "03": <CloudyIcon size={72} />, // scattered clouds
  "04": <CloudyIcon size={72} />, // broken clouds
  "09": <CloudRainIcon size={72} />, // shower rain
  "10": <CloudRainIcon size={72} />, // rain
  "11": <CloudLightningIcon size={72} />, // thunderstorm
  "13": <CloudSnowIcon size={72} />, // snow
  "50": <CloudFog size={72} />, // mist
};
