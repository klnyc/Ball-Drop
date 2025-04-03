import "../styles/GameOverAlert.css";
import { useEffect, useState } from "react";

const duration = 2_000; // match CSS pulse animation duration

const GameOverAlert = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return isVisible ? <div id="game-over-alert">Game Over</div> : <></>;
};

export { GameOverAlert };
