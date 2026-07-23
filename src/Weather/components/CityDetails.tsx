import { City } from "../constants";
import KeyValuePair from "../../common/components/KeyValuePair";

interface CityDetailsProps {
  cityDetails: City;
}

const CityDetails = ({ cityDetails }: CityDetailsProps) => {
  const details = [
    { keyString: "Temperature", value: `${cityDetails.temperature}` },
    { keyString: "Feels like", value: `${cityDetails.feelsLike}` },
    { keyString: "High", value: `${cityDetails.high}` },
    { keyString: "Low", value: `${cityDetails.low}` },
    { keyString: "Humidity", value: `${cityDetails.humidity}` },
    { keyString: "Wind speed", value: `${cityDetails.windSpeed} mph` },
  ];

  return (
    <div className="city-detail-key-values">
      {details.map((detail) => (
        <KeyValuePair
          keyString={detail.keyString}
          value={detail.value}
          key={detail.keyString}
        />
      ))}
    </div>
  );
};

export default CityDetails;
