import { useEffect, useState } from "react";

interface GameOverAlertProps {
  score: number;
}

const GameOverAlert = ({ score }: GameOverAlertProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const duration = 2_000; // match CSS pulse animation duration
  const finalScore = score < 0 ? 0 : score;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return isVisible ? (
    <div className="game-over-alert">Final score: {finalScore}</div>
  ) : (
    <></>
  );
};

export { GameOverAlert };
