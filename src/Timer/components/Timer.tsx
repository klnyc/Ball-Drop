import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";

// input for time
// checkbox for single (default) and continuous
// button to start/cancel

// states:
// game start, playing

const Timer = () => {
  return (
    <div className="timer-container">
      <BackToPlayboxButton color="purple" />
    </div>
  );
};

export default Timer;
