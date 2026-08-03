import { Dispatch, SetStateAction } from "react";

interface RadioProps {
  name: string;
  value: string;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}

const Radio = ({ selected, setSelected, name, value }: RadioProps) => {
  const handleChange = () => {
    setSelected(value);
  };

  return (
    <label>
      <input
        type="radio"
        checked={selected === value}
        value={value}
        onChange={handleChange}
      />
      {name}
    </label>
  );
};

export default Radio;
