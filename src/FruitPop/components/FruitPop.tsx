import { useEffect, useState } from "react";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import { GameOverAlert } from "./GameOverAlert";
import icons from "./Icons";

const FruitPop = () => {
  const gameTime = 10;
  const cellCount = 25;
  const cells = new Array(cellCount).fill(null);

  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(gameTime);
  const [activeCellIndices, setActiveCellIndices] = useState<number[]>([]);
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [fruitCount, setFruitCount] = useState<number>(0);

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
    }, 1500);

    return () => clearInterval(timer);
  }, [gameStart]);

  const startGame = () => {
    setGameStart(true);
    setTime(gameTime);
    setScore(0);
    setFruitCount(0);
  };

  const onFruitClick = (cellIndex: number, isFruit: boolean) => {
    if (isFruit) setFruitCount((count) => count + 1);
    setScore((score) => (isFruit ? score + 1 : score - 1));
    setActiveCellIndices(
      [...activeCellIndices].filter((index) => index !== cellIndex),
    );
  };

  return (
    <div className="fruit-pop-container">
      <div className="fruit-pop-header">
        <div>Score: {score}</div>
        <div>Timer: {time}</div>
      </div>

      <div className="fruit-pop-grid">
        {cells.map((_, cellIndex) => {
          const iconIndex = Math.floor(Math.random() * icons.length);
          const icon = icons[iconIndex];
          return (
            <div key={cellIndex}>
              <div
                className={`fruit-pop-cell-item ${activeCellIndices.includes(cellIndex) ? "active" : ""}`}
                onClick={() => onFruitClick(cellIndex, icon.isFruit)}
              >
                {icon.icon}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fruit-pop-footer">
        <BackToPlayboxButton />
        <button
          className="fruit-pop-start-button"
          onClick={startGame}
          disabled={gameStart}
        >
          {gameStart ? "Game started!" : "Start Game"}
        </button>
      </div>

      {!gameStart && time === 0 && (
        <GameOverAlert score={score} fruitCount={fruitCount} />
      )}
    </div>
  );
};

export default FruitPop;
