import {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import Dropdown from "../../common/components/Dropdown";
import Radio from "../../common/components/Radio";
import { colors } from "../../common/contants";

type TimerMode = "single" | "continuous";

const Timer = () => {
  const [isTimerOn, setIsTimerOn] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("single");
  const [minuteSelection, setMinuteSelection] = useState<string>("1");
  const [secondSelection, setSecondSelection] = useState<string>("0");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(timeLeft);
  const audioContextRef = useRef<AudioContext | null>(null);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const minuteDisplay = String(minutes).padStart(2, "0");
  const secondDisplay = String(seconds).padStart(2, "0");
  const progressPercentage = (timeLeft / initialTime) * 100;

  const minutesItems = useMemo(() => {
    return Array(61)
      .fill(null)
      .map((_, index) => ({ name: `${index}` }));
  }, []);

  const secondsItems = useMemo(() => {
    return [...minutesItems].slice(1);
  }, []);

  const startTimer = () => {
    const seconds = Number(minuteSelection) * 60 + Number(secondSelection);
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setIsTimerOn(true);
  };

  const playSound = useCallback(() => {
    // Initialize the AudioContext only when needed (browsers block it from starting on page load)
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }

    const ctx = audioContextRef.current;

    const createSound = (startTime: number, frequency: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, startTime);

      // Volume Envelope: Start at 0, instantly jump to loud, then slowly fade out
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.7, startTime + 0.01); // Quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2); // Slow fade out (decay)

      // Connect nodes: Oscillator -> Gain -> Speakers
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.2); // Stop playing when the fade out is done
    };

    const now = ctx.currentTime;

    createSound(now, 523); // First ding
    createSound(now + 0.1, 659); // Second ding 0.1 seconds later
    createSound(now + 0.2, 784);
    createSound(now + 0.3, 1046);
  }, []);

  useEffect(() => {
    if (!isTimerOn) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          if (timerMode === "single") {
            setIsTimerOn(false);
            clearInterval(intervalId);
            return 0;
          } else {
            return initialTime;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTimerOn, timerMode]);

  useEffect(() => {
    if (isTimerOn && timeLeft === 0) {
      playSound();
    }
  }, [isTimerOn, timeLeft]);

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
      <div className="timer-progress-bar">
        <div
          style={{
            height: "100%",
            width: `${progressPercentage}%`,
            backgroundColor:
              progressPercentage < 20 ? colors.coral : colors.purple,
            transition: timeLeft === initialTime ? "none" : "width 1s linear", // Smooth 1s linear transition going down, but instantly snaps back to 100% when resetting
          }}
        />
      </div>
    </div>
  );
};

export default Timer;
