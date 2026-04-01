import { useState, useRef, useEffect } from "react";
import { ElevatorLogic, type ElevatorInterface } from "./ElevatorLogic";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import { ZapIcon } from "lucide-react";

const Elevator = () => {
  const [displayFloor, setDisplayFloor] = useState<number>(1);
  const elevatorRef = useRef<ElevatorInterface>(null);
  const floorCount = 9;
  const floorHeight = 60;
  const floors = [];

  for (let floor = floorCount; floor > 0; floor--) {
    floors.unshift(floor);
  }

  if (!elevatorRef.current) {
    elevatorRef.current = new ElevatorLogic();
  }

  useEffect(() => {
    // connect React with the elevator class' internal state
    // so the elevator class can call setState and rerender the elevator
    if (elevatorRef.current) {
      elevatorRef.current.onFloorChange = setDisplayFloor;
    }
  }, []);

  const handleButtonPress = (floor: number) => {
    elevatorRef.current?.requestFloor(floor);
  };

  return (
    <div id="elevator-container">
      <div className="building">
        {floors.map(() => (
          <div className="building-floor"></div>
        ))}
        <div
          className="elevator"
          style={{
            bottom: (elevatorRef.current.currentFloor - 1) * floorHeight,
          }}
        >
          <ZapIcon />
        </div>
      </div>
      <div className="elevator-controls">
        <div>Floor {displayFloor}</div>
        <div className="elevator-buttons">
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => handleButtonPress(floor)}
              className={
                elevatorRef.current?.queue.includes(floor)
                  ? "elevator-button-pressed"
                  : ""
              }
            >
              {floor}
            </button>
          ))}
        </div>
        <BackToPlayboxButton />
      </div>
    </div>
  );
};

export default Elevator;
