import { useState, useEffect, useRef, useCallback } from "react";
import { colors } from "../../common/contants";

interface Dog {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  isJumping: boolean;
  jumpsLeft: number;
  rotation: number;
}

interface Obstacle {
  type: "🌵" | "🚧";
  x: number;
  y: number;
  width: number;
  height: number;
  hitboxWidth: number;
  hitboxHeightOffset: number;
}

interface Cloud {
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface GameStateRef {
  score: number;
  gameSpeed: number;
  frames: number;
  obstacles: Obstacle[];
  clouds: Cloud[];
  particles: Particle[];
  animationId: number | null;
  dog: Dog;
}

type GameMode = "START" | "PLAYING" | "GAMEOVER";

const GROUND_HEIGHT = 60;
const GRAVITY = 0.6; // Soft gravity for highly controllable double jumps
const JUMP_STRENGTH = -11.5;
const DOUBLE_JUMP_STRENGTH = -9.5;
const INITIAL_SPEED = 5.5;

const DogJump = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameMode>("START");
  const [finalScore, setFinalScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem("dog_jump_highscore") || "0", 10);
      //The second parameter (10) is the radix (or mathematical base),
      // which tells the JavaScript engine to interpret the string as a standard decimal number
    } catch {
      return 0;
    }
  });

  // Mutable state reference to maintain 60 FPS animation loop without state delays
  const gameRef = useRef<GameStateRef>({
    score: 0,
    gameSpeed: INITIAL_SPEED,
    frames: 0,
    obstacles: [],
    clouds: [],
    particles: [],
    animationId: null,
    dog: {
      x: 120,
      y: 0,
      width: 50,
      height: 35,
      vy: 0,
      isJumping: false,
      jumpsLeft: 2, // Enable Double Jumping
      rotation: 0,
    },
  });

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
  };

  const playSound = (type: "jump" | "doublejump" | "crash" | "milestone") => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state === "suspended") return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "jump") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "doublejump") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "crash") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === "milestone") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 Key
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5 Key
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  };

  const getObstacleData = (type: "🌵" | "🚧") => {
    switch (type) {
      case "🌵":
        return {
          width: 40,
          height: Math.random() > 0.5 ? 45 : 60,
          hitboxWidth: 16, // Snug width fits only the cactus trunk
          hitboxHeightOffset: 0, // Makes the hitbox taller or shorter
        };
      case "🚧":
      default:
        return {
          width: 40,
          height: 40,
          hitboxWidth: 34, // Spans across the barrier
          hitboxHeightOffset: 0,
        };
    }
  };

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = gameRef.current;
    state.score = 0;
    state.gameSpeed = INITIAL_SPEED;
    state.frames = 0;
    state.obstacles = [];
    state.clouds = [];
    state.particles = [];

    state.dog.y = canvas.height - GROUND_HEIGHT - state.dog.height;
    state.dog.vy = 0;
    state.dog.isJumping = false;
    state.dog.jumpsLeft = 2;
    state.dog.rotation = 0;

    // Prefill decorative clouds
    for (let i = 0; i < 10; i++) {
      state.clouds.push({
        x: Math.random() * canvas.width,
        y: 40 + Math.random() * (canvas.height / 2.5),
        size: 30 + Math.random() * 35,
        speed: (Math.random() * 0.3 + 0.1) * (state.gameSpeed / 5.5),
      });
    }
  }, []);

  const startGame = () => {
    initAudio();
    resetGame();
    setTimeout(() => setGameState("PLAYING"), 50);
  };

  const jump = useCallback(() => {
    const state = gameRef.current;
    if (state.dog.jumpsLeft > 0) {
      if (state.dog.jumpsLeft === 2) {
        // First Jump (from Ground)
        state.dog.vy = JUMP_STRENGTH;
        state.dog.isJumping = true;
        state.dog.jumpsLeft = 1;
        playSound("jump");

        // Spawn custom dirt clouds at ground position
        for (let i = 0; i < 8; i++) {
          state.particles.push({
            x: state.dog.x + state.dog.width / 2,
            y: state.dog.y + state.dog.height,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 3 - 1,
            size: 3 + Math.random() * 4,
            alpha: 1,
            color: "rgba(255, 255, 255, 0.7)",
          });
        }
      } else if (state.dog.jumpsLeft === 1) {
        // Second Jump (Mid-air Flip!)
        state.dog.vy = DOUBLE_JUMP_STRENGTH;
        state.dog.jumpsLeft = 0;
        state.dog.rotation = 0.1; // Begin flip animation
        playSound("doublejump");

        // Playful starburst particles
        for (let i = 0; i < 12; i++) {
          state.particles.push({
            x: state.dog.x + state.dog.width / 2,
            y: state.dog.y + state.dog.height / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            size: 4 + Math.random() * 4,
            alpha: 1,
            color: "rgba(251, 191, 36, 0.8)",
          });
        }
      }
    }
  }, [isMuted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const state = gameRef.current;

    const gameLoop = () => {
      if (gameState !== "PLAYING") return;

      // Reset and clear frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Advance game progress metrics
      state.gameSpeed += 0.0015; // Increases game speed after every frame
      const prevScore = Math.floor(state.score);
      state.score += 0.05;
      const currScore = Math.floor(state.score);

      // This condition evaluates to true exactly once
      // at the precise microsecond the score transitions from $99.95$ to $100.00$.
      // It prevents the chime from double-triggering or skipping entirely!
      if (currScore > 0 && currScore % 100 === 0 && currScore !== prevScore) {
        playSound("milestone");
      }

      state.frames++;

      if (state.frames % 160 === 0) {
        state.clouds.push({
          x: canvas.width + 100,
          y: 30 + Math.random() * (canvas.height / 2.5),
          size: 30 + Math.random() * 35,
          speed: (Math.random() * 0.3 + 0.1) * (state.gameSpeed / 5.5),
        });
      }

      for (let i = state.clouds.length - 1; i >= 0; i--) {
        const cloud = state.clouds[i];
        cloud.x -= cloud.speed;

        ctx.save();
        ctx.font = `${cloud.size}px Arial`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("☁️", cloud.x, cloud.y);
        ctx.restore();

        // ctx.save() (paired with ctx.restore())
        // to freeze the canvas's styling state
        // (like font, fillStyle, and alignments) before drawing a cloud.
        // This prevents the cloud's unique size, transparency, and text alignments
        // from leaking out and accidentally styling the dog, obstacles, or score

        if (cloud.x + cloud.size * 1.5 < 0) {
          state.clouds.splice(i, 1);
        }
      }

      ctx.save();
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(
        0,
        canvas.height - GROUND_HEIGHT,
        canvas.width,
        GROUND_HEIGHT,
      );
      ctx.fillStyle = colors.black;
      ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, 10);
      ctx.restore();

      if (!state.dog.isJumping && state.frames % 5 === 0) {
        state.particles.push({
          x: state.dog.x + 8,
          y: state.dog.y + state.dog.height - 4,
          vx: -state.gameSpeed * 0.4 - Math.random() * 1.5,
          vy: -Math.random() * 1.5,
          size: 3 + Math.random() * 4,
          alpha: 0.7,
          color: "rgba(222, 184, 135, 0.8)",
        });
      }

      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.alpha <= 0) {
          state.particles.splice(i, 1);
        }
      }

      state.dog.vy += GRAVITY;
      state.dog.y += state.dog.vy;

      const groundLimitY = canvas.height - GROUND_HEIGHT - state.dog.height;
      if (state.dog.y >= groundLimitY) {
        state.dog.y = groundLimitY;
        state.dog.vy = 0;
        state.dog.isJumping = false;
        state.dog.jumpsLeft = 2;
        state.dog.rotation = 0;
      }

      if (state.dog.rotation > 0) {
        state.dog.rotation += 0.18; // Apply spinning velocity
      }

      ctx.save();
      // Translate coordinates to visual center of dog to rotate seamlessly
      ctx.translate(
        state.dog.x + state.dog.width / 2,
        state.dog.y + state.dog.height / 2,
      );
      ctx.scale(-1, 1); // Mirror dog horizontally to face RIGHT
      ctx.rotate(state.dog.rotation);
      ctx.font = "46px Arial";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText("🐕", 0, 0);
      ctx.restore();

      // Dog collision mapping
      const dHit = {
        x: state.dog.x + 9,
        y: state.dog.y,
        w: 32,
        h: 40,
      };

      if (debugMode) {
        ctx.save();
        ctx.strokeStyle = colors.black;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(dHit.x, dHit.y, dHit.w, dHit.h);
        ctx.fillStyle = "rgba(197, 45, 34, 0.15)";
        ctx.fillRect(dHit.x, dHit.y, dHit.w, dHit.h);
        ctx.restore();
      }

      const spawnRate = Math.max(65, 115 - Math.floor(state.gameSpeed * 6));
      if (state.frames % spawnRate === 0) {
        const type: "🌵" | "🚧" = Math.random() > 0.45 ? "🌵" : "🚧";
        const specs = getObstacleData(type);
        state.obstacles.push({
          type,
          x: canvas.width + 10,
          y: canvas.height - GROUND_HEIGHT - specs.height,
          ...specs,
        });
      }

      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.x -= state.gameSpeed;

        ctx.save();
        ctx.font = `${obs.height + 6}px Arial`;
        ctx.textBaseline = "bottom";
        ctx.textAlign = "center"; // Center visual text to prevent platform baselines shifting
        ctx.fillText(
          obs.type,
          obs.x + obs.width / 2,
          canvas.height - GROUND_HEIGHT + 8, // How the obstacles are placed on the ground
        );
        ctx.restore();

        const centerX = obs.x + obs.width / 2;
        const oHit = {
          x: centerX - obs.hitboxWidth / 2,
          y: obs.y - obs.hitboxHeightOffset,
          w: obs.hitboxWidth,
          h: obs.height + obs.hitboxHeightOffset,
        };

        if (debugMode) {
          ctx.save();
          ctx.strokeStyle = colors.black;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(oHit.x, oHit.y, oHit.w, oHit.h);
          ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
          ctx.fillRect(oHit.x, oHit.y, oHit.w, oHit.h);
          ctx.restore();
        }

        // AABB (Axis-Aligned Bounding Box) Intersect Collision Math
        const hasCollided =
          dHit.x < oHit.x + oHit.w &&
          dHit.x + dHit.w > oHit.x &&
          dHit.y < oHit.y + oHit.h &&
          dHit.y + dHit.h > oHit.y;

        if (hasCollided) {
          playSound("crash");
          const finalVal = Math.floor(state.score);
          setFinalScore(finalVal);
          if (finalVal > highScore) {
            setHighScore(finalVal);
            try {
              localStorage.setItem("dog_jump_highscore", finalVal.toString());
            } catch {}
          }
          setGameState("GAMEOVER");
          return;
        }

        if (obs.x + obs.width < -50) {
          state.obstacles.splice(i, 1);
        }
      }

      // Draw Top HUD Score (completely isolated to prevent layout drift)
      ctx.save();
      ctx.fillStyle = colors.black;
      ctx.font = "bold 22px system-ui";
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillText(`Score: ${Math.floor(state.score)}`, canvas.width - 25, 30);
      ctx.restore();

      state.animationId = requestAnimationFrame(gameLoop);
    };

    if (gameState === "PLAYING") {
      state.animationId = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (state.animationId) cancelAnimationFrame(state.animationId);
    };
  }, [gameState, debugMode, isMuted, highScore]);

  useEffect(() => {
    const handleInput = (e: Event) => {
      if (gameState === "PLAYING") {
        if (
          e instanceof KeyboardEvent &&
          (e.code === "Space" || e.code === "ArrowUp")
        ) {
          e.preventDefault();
          jump();
        } else if (e.type === "mousedown" || e.type === "touchstart") {
          const target = e.target as HTMLElement;
          if (
            target &&
            target.tagName !== "BUTTON" &&
            !target.closest("button")
          ) {
            jump();
          }
        }
      } else if (
        gameState === "GAMEOVER" &&
        e instanceof KeyboardEvent &&
        e.code === "Space"
      ) {
        startGame();
      }
    };

    window.addEventListener("keydown", handleInput);
    window.addEventListener("mousedown", handleInput);
    window.addEventListener("touchstart", handleInput, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleInput);
      window.removeEventListener("mousedown", handleInput);
      window.removeEventListener("touchstart", handleInput);
    };
  }, [gameState, jump]);

  // Handle Static Frame Setup
  useEffect(() => {
    if (gameState === "START") {
      resetGame();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const state = gameRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#8B4513";
      ctx.fillRect(
        0,
        canvas.height - GROUND_HEIGHT,
        canvas.width,
        GROUND_HEIGHT,
      );
      ctx.fillStyle = colors.black;
      ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, 10);

      ctx.save();
      ctx.translate(
        state.dog.x + state.dog.width / 2,
        state.dog.y + state.dog.height / 2,
      );
      ctx.scale(-1, 1);
      ctx.font = "46px Arial";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText("🐕", 0, 0);
      ctx.restore();
    }
  }, [gameState, resetGame]);

  return (
    <div className="game-wrapper">
      <style>{`
        .game-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(to bottom, #bae6fd 0%, #e0e7ff 100%);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 16px;
          box-sizing: border-box;
          user-select: none;
          -webkit-user-select: none;
          touch-action: none;
        }

        .game-wrapper * {
          box-sizing: border-box;
        }

        .game-frame {
          position: relative;
          width: 100%;
          max-width: 800px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(to bottom, #38bdf8, #f0f9ff);
          border: 4px solid rgba(255, 255, 255, 0.6);
        }

        .game-canvas {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 2 / 1;
          border-radius: 12px;
        }

        .screen-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(2px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
          z-index: 10;
        }

        .screen-overlay-dark {
          background-color: rgba(2, 6, 23, 0.65);
        }

        .modal-card {
          background-color: rgba(255, 255, 255, 0.95);
          padding: 32px;
          border-radius: 16px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 2px solid #4ade80;
          transition: transform 0.2s ease;
        }

        .modal-card.gameover {
          border-color: #ef4444;
          animation: cardBounce 1s infinite alternate ease-in-out;
        }

        @keyframes cardBounce {
          from { transform: translateY(0); }
          to { transform: translateY(-8px); }
        }

        .title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 8px 0;
          letter-spacing: -0.025em;
        }

        .title-red {
          color: #dc2626;
        }

        .subtitle {
          color: #475569;
          font-size: 1rem;
          margin: 0 0 24px 0;
        }

        .subtitle-caps {
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #64748b;
          margin: 0 0 16px 0;
        }

        .score-board {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background-color: #f1f5f9;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .score-col {
          display: flex;
          flex-direction: column;
        }

        .score-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .score-val {
          font-size: 1.5rem;
          font-weight: 900;
          color: #334155;
        }

        .score-val.high {
          color: #f59e0b;
        }

        .score-divider {
          width: 1px;
          height: 32px;
          background-color: #cbd5e1;
        }

        .btn {
          display: inline-block;
          width: 100%;
          border: none;
          font-weight: 700;
          padding: 14px 28px;
          font-size: 1.125rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .btn-green {
          background-color: #22c55e;
          color: #ffffff;
        }
        .btn-green:hover {
          background-color: #16a34a;
        }

        .btn-blue {
          background-color: #3b82f6;
          color: #ffffff;
        }
        .btn-blue:hover {
          background-color: #2563eb;
        }

        .btn:active {
          transform: scale(0.95);
        }

        .instructions-list {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
        }

        .controls-footer {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          justify-content: center;
          max-width: 800px;
          width: 100%;
          padding: 0 16px;
        }

        .btn-control {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #ffffff;
          border: 2px solid #cbd5e1;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-control:hover {
          border-color: #94a3b8;
        }

        .btn-control.active-green {
          background-color: #dcfce7;
          border-color: #22c55e;
          color: #15803d;
        }

        .btn-control.active-rose {
          background-color: #ffe4e6;
          border-color: #f43f5e;
          color: #be123c;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #94a3b8;
        }

        .status-dot.active {
          background-color: #22c55e;
        }

        .score-badge {
          background-color: rgba(30, 41, 59, 0.85);
          color: #f8fafc;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .score-badge span {
          color: #fbbf24;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .tip-text {
          margin-top: 16px;
          font-size: 0.75rem;
          color: #64748b;
          text-align: center;
        }

        .tip-text span {
          font-weight: 700;
          color: #475569;
        }
      `}</style>

      <div className="game-frame">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="game-canvas"
        />

        {gameState === "START" && (
          <div className="screen-overlay">
            <div className="modal-card">
              <h1 className="title">Super Dog Jump!</h1>
              <p className="subtitle">
                Leap over desert cactuses and safety barriers with agility.
              </p>

              <button onClick={startGame} className="btn btn-green">
                Play Game
              </button>

              <div className="instructions-list">
                <div>⚡ Space, Up Arrow, or Tap Screen to Jump</div>
                <div>💫 Tap Twice to Double-Jump/Flip!</div>
              </div>
            </div>
          </div>
        )}

        {gameState === "GAMEOVER" && (
          <div className="screen-overlay screen-overlay-dark">
            <div className="modal-card gameover">
              <h1 className="title title-red">Game Over!</h1>
              <p className="subtitle-caps">Run Completed</p>

              <div className="score-board">
                <div className="score-col">
                  <span className="score-label">Score</span>
                  <span className="score-val">{finalScore}</span>
                </div>
                <div className="score-divider" />
                <div className="score-col">
                  <span className="score-label">Best</span>
                  <span className="score-val high">{highScore}</span>
                </div>
              </div>

              <button onClick={startGame} className="btn btn-blue">
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="controls-footer">
        <button
          onClick={() => setDebugMode((prev) => !prev)}
          className={`btn-control ${debugMode ? "active-green" : ""}`}
        >
          <span className={`status-dot ${debugMode ? "active" : ""}`} />
          {debugMode ? "Hide Hitboxes" : "Show Hitboxes"}
        </button>

        <button
          onClick={() => setIsMuted((prev) => !prev)}
          className={`btn-control ${isMuted ? "active-rose" : ""}`}
        >
          <span>{isMuted ? "🔇 Audio Muted" : "🔊 Audio Active"}</span>
        </button>

        <div className="score-badge">
          Best Score: <span>{highScore}</span>
        </div>
      </div>

      <div className="tip-text">
        Tip: Switch on <span>Show Hitboxes</span> to see the pixel-perfect
        alignment in real time!
      </div>
    </div>
  );
};

export default DogJump;
