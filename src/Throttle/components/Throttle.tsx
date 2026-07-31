import { useCallback, useState } from "react";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";

const Throttle = () => {
  const [throttledTimestamps, setThrottledTimestamps] = useState<string[]>([]);
  const [allTimestamps, setAllTimestamps] = useState<string[]>([]);

  const throttle = (func: () => void, delay: number) => {
    let wait = false;

    return () => {
      if (!wait) {
        func();
        wait = true;
        setTimeout(() => {
          wait = false;
        }, delay);
      }
    };
  };

  const handleAllClicks = () => {
    const now = Date.now();
    const date = new Date(now);
    setAllTimestamps((prev) => [`Received at ${date.toString()}`, ...prev]);
  };

  const handleThrottledClick = () => {
    const now = Date.now();
    const date = new Date(now);
    setThrottledTimestamps((prev) => [
      `Received at ${date.toString()}`,
      ...prev,
    ]);
  };

  // needs to be in useCallback, otherwise, setThrottledTimestamps will cause a rerender which resets the throttle function
  const throttleCallback = useCallback(
    throttle(handleThrottledClick, 3000),
    [],
  );

  const handleClick = () => {
    throttleCallback();
    handleAllClicks();
  };

  return (
    <div className="throttle-container">
      <BackToPlayboxButton color="purple" />
      <div className="throttle-body">
        <h3>Throttle Simulator</h3>
        <p>
          Throttled click can only be triggered once every 3 seconds no matter
          how fast you click.
        </p>
        <button onClick={handleClick}>Click</button>

        <div className="throttle-timestamp-lists">
          <div className="throttle-timestamp-column">
            <div className="throttle-timestamp-title">Throttled clicks</div>
            <div className="throttle-timestamp-list">
              {throttledTimestamps.map((timestamp, index) => (
                <p key={index}>{timestamp}</p>
              ))}
            </div>
          </div>
          <div className="throttle-timestamp-column">
            <div className="throttle-timestamp-title">All clicks</div>
            <div className="throttle-timestamp-list">
              {allTimestamps.map((timestamp, index) => (
                <p key={index}>{timestamp}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Throttle;
