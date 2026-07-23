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

export const cities: string[] = [
  "New York",
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
