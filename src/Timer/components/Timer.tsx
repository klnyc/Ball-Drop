import {
  useEffect,
  useState,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import Dropdown from "../../common/components/Dropdown";
import Radio from "../../common/components/Radio";

type TimerMode = "single" | "continuous";

const Timer = () => {
  const [timerMode, setTimerMode] = useState<TimerMode>("single");
  const [minuteSelection, setMinuteSelection] = useState<string>("1");
  const [secondSelection, setSecondSelection] = useState<string>("0");
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const minutesItems = useMemo(() => {
    return Array(61)
      .fill(null)
      .map((_, index) => ({ name: `${index}` }));
  }, []);

  const secondsItems = useMemo(() => {
    return [...minutesItems].slice(1);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const startTimer = () => {
    setTimeLeft(Number(minuteSelection) * 60 + Number(secondSelection));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const minuteDisplay = String(minutes).padStart(2, "0");
  const secondDisplay = String(seconds).padStart(2, "0");

  return (
    <div className="timer-container">
      <BackToPlayboxButton color="purple" />
      <div className="timer-selectors">
        <div className="timer-selector">
          <div className="timer-selector-label">Minutes</div>
          <Dropdown
            items={minutesItems}
            selectedItem={minuteSelection}
            setSelectedItem={setMinuteSelection}
          />
        </div>
        <div className="timer-selector">
          <div className="timer-selector-label">Seconds</div>
          <Dropdown
            items={secondsItems}
            selectedItem={secondSelection}
            setSelectedItem={setSecondSelection}
          />
        </div>
      </div>
      <div className="timer-selector-radio-group">
        <Radio
          name="Single"
          value="single"
          selected={timerMode}
          setSelected={setTimerMode as Dispatch<SetStateAction<string>>}
        />
        <Radio
          name="Continuous"
          value="continuous"
          selected={timerMode}
          setSelected={setTimerMode as Dispatch<SetStateAction<string>>}
        />
      </div>
      <div className="timer-selector-start-button">
        <button onClick={() => startTimer()}>Start</button>
      </div>
      <div className="timer-display">{`${minuteDisplay}:${secondDisplay}`}</div>
    </div>
  );
};

export default Timer;
