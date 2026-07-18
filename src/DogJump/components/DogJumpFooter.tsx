import { SetStateAction } from "react";
interface DogJumpFooterProps {
  highScore: number;
  debugMode: boolean;
  setDebugMode: (value: SetStateAction<boolean>) => void;
  isMuted: boolean;
  setIsMuted: (value: SetStateAction<boolean>) => void;
}

const DogJumpFooter = ({
  highScore,
  debugMode,
  setDebugMode,
  isMuted,
  setIsMuted,
}: DogJumpFooterProps) => {
  return (
    <div className="dog-jump-footer">
      <button
        onClick={() => setDebugMode((prev) => !prev)}
        className={`dog-jump-button-control ${debugMode ? "active-green" : ""}`}
      >
        <span
          className={`dog-jump-button-status-dot ${debugMode ? "active" : ""}`}
        />
        {debugMode ? "Hide Hitboxes" : "Show Hitboxes"}
      </button>

      <button
        onClick={() => setIsMuted((prev) => !prev)}
        className={`dog-jump-button-control ${isMuted ? "active-rose" : ""}`}
      >
        <span>{isMuted ? "🔇 Audio Muted" : "🔊 Audio Active"}</span>
      </button>

      <div className="dog-jump-score-badge">
        Best Score: <span>{highScore}</span>
      </div>

      <div className="dog-jump-tip-text">
        Tip: Switch on <span>Show Hitboxes</span> to see the pixel-perfect
        alignment in real time!
      </div>
    </div>
  );
};

export default DogJumpFooter;
