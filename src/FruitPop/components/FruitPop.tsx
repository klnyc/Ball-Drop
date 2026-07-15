import { useEffect, useState } from "react";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import { AppleIcon } from "lucide-react";

const FruitPop = () => {
  const gameTime = 10;
  const cellCount = 25;
  const cells = new Array(cellCount).fill(null);

  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(gameTime);
  const [activeCellIndices, setActiveCellIndices] = useState<number[]>([]);
  const [gameStart, setGameStart] = useState<boolean>(false);

  useEffect(() => {
    if (!gameStart) return;

    const timer = setInterval(() => {
      setTime((time) => {
        if (time > 0) {
          const randomIndex = Math.floor(Math.random() * cellCount);
          const newActiveCells = [randomIndex];
          setActiveCellIndices(newActiveCells);
          return time - 1;
        } else {
          setActiveCellIndices([]);
          setGameStart(false);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStart]);

  const startGame = () => {
    setGameStart(true);
    setTime(gameTime);
    setScore(0);
  };

  const onFruitClick = (index: number) => {
    setScore((score) => score + 1);
    setActiveCellIndices(
      [...activeCellIndices].filter((cellIndex) => cellIndex !== index),
    );
  };

  return (
    <div className="fruit-pop-container">
      <div className="fruit-pop-header">
        <div>Score: {score}</div>
        <div>Timer: {time}</div>
      </div>

      <div className="fruit-pop-grid">
        {cells.map((_, index) => {
          return (
            <div key={index}>
              <div
                className={`fruit-pop-cell-item ${activeCellIndices.includes(index) ? "active" : ""}`}
                onClick={() => onFruitClick(index)}
              >
                <AppleIcon color="green" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="fruit-pop-footer">
        <button
          className="fruit-pop-start-button"
          onClick={startGame}
          disabled={gameStart}
        >
          {gameStart ? "Game started!" : "Start Game"}
        </button>
        <BackToPlayboxButton />
      </div>
    </div>
  );
};

export default FruitPop;
