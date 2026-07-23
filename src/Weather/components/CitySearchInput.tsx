import { type ChangeEvent, type KeyboardEvent } from "react";
import { SearchIcon } from "lucide-react";

interface CitySearchInputProps {
  cityInput: string;
  handleCityInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSearchCityOnKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleSearchCity: () => void;
  error: boolean;
}

const CitySearchInput = ({
  cityInput,
  handleCityInputChange,
  handleSearchCityOnKeyPress,
  handleSearchCity,
  error,
}: CitySearchInputProps) => {
  return (
    <div className="weather-search-input weather-header-item">
      <input
        value={cityInput}
        onChange={handleCityInputChange}
        onKeyDown={handleSearchCityOnKeyPress}
        placeholder="Search city"
      />
      <button onClick={() => handleSearchCity()}>
        <SearchIcon size={16} />
      </button>
      <div className="weather-error">{error ? "Invalid city" : ""}</div>
    </div>
  );
};

export default CitySearchInput;
