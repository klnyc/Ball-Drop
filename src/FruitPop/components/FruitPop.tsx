import { useEffect, useState } from "react";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import { GameOverAlert } from "./GameOverAlert";
import { MouseTracker } from "./MouseTracker";
import icons from "./Icons";
import Modal from "../../common/components/Modal";

const FruitPop = () => {
  const gameTime = 10;
  const cellCount = 25;
  const cells = new Array(cellCount).fill(null);
  const gameDescription = `Pop all the fruits before the timer runs out. Be careful not to touch the vegetables!`;
  const scoreUpdateFadeTime = 500;

  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(gameTime);
  const [activeCellIndices, setActiveCellIndices] = useState<number[]>([]);
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState<boolean>(false);
  const [showPlusOne, setShowPlusOne] = useState<boolean>(false);
  const [showMinusOne, setShowMinusOne] = useState<boolean>(false);

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
  };

  const onFruitClick = (cellIndex: number, isFruit: boolean) => {
    if (isFruit) {
      setShowPlusOne(true);
      setTimeout(() => {
        setShowPlusOne(false);
      }, scoreUpdateFadeTime);
    } else {
      setShowMinusOne(true);
      setTimeout(() => {
        setShowMinusOne(false);
      }, scoreUpdateFadeTime);
    }

    setScore((score) => (isFruit ? score + 1 : score - 1));
    setActiveCellIndices(
      [...activeCellIndices].filter((index) => index !== cellIndex),
    );
  };

  return (
    <div className="fruit-pop-container">
      <div className="fruit-pop-header">
        <div className="fruit-pop-score">
          <div>Score: {score}</div>
          <div
            className={`fruit-pop-score-update ${showPlusOne ? "plus" : showMinusOne ? "minus" : "hidden"}`}
          >
            {`${showPlusOne ? "+1" : showMinusOne ? "-1" : ""}`}
          </div>
        </div>
        <div>Timer: {time}s</div>
        <MouseTracker />
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
          className="how-to-play-button"
          onClick={() => setShowHowToPlayModal(true)}
        >
          How to play
        </button>
        <button
          className="fruit-pop-start-button"
          onClick={startGame}
          disabled={gameStart}
        >
          {gameStart ? "Game started!" : "Start Game"}
        </button>
      </div>

      {showHowToPlayModal && (
        <Modal
          title="Fruit Pop"
          description={gameDescription}
          onClose={() => setShowHowToPlayModal(false)}
        />
      )}

      {!gameStart && time === 0 && <GameOverAlert score={score} />}
    </div>
  );
};

export default FruitPop;
