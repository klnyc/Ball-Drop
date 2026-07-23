interface KeyValuePairProps {
  keyString: string;
  value: string;
}

const KeyValuePair = ({ keyString, value }: KeyValuePairProps) => {
  return (
    <div className="key-value-pair">
      <div className="keyString">{keyString}</div>
      <div className="valueString">{value}</div>
    </div>
  );
};

export default KeyValuePair;
