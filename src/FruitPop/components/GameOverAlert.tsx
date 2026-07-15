import { useEffect, useState } from "react";

interface GameOverAlertProps {
  score: number;
  fruitCount: number;
}

const GameOverAlert = ({ score, fruitCount }: GameOverAlertProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const duration = 2_000; // match CSS pulse animation duration

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return isVisible ? (
    <div className="game-over-alert">{(score / fruitCount) * 100}%</div>
  ) : (
    <></>
  );
};

export { GameOverAlert };
