import "../styles/Canvas.css";
import { useRef, useEffect, useState } from "react";
import { getRandomNumber } from "../utility";
import { GameOverAlert } from "./GameOverAlert";
import { MouseTracker } from "./MouseTracker";
import ballSvg from "../icons/pokeball.svg";

interface Basket {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
}

const initialBall: Ball = {
  x: getRandomNumber() * 300,
  y: 0,
  radius: 30,
  speed: 2, // starting speed
};

const basketWidth = 100;
const basketHeight = 10;

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRequestId = useRef<number | null>(null);
  const [basket, setBasket] = useState<Basket>();
  const [ball, setBall] = useState<Ball>(initialBall);
  const [score, setScore] = useState<number>(0);
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");

  const ballImage: HTMLImageElement = new Image();
  ballImage.src = ballSvg;

  const initiateCanvas = (): void => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // sets canvas dimensions to its parent container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context.fillStyle = "transparent";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const initialBasket: Basket = {
      x: canvas.width / 2,
      y: canvas.height - 80,
      width: basketWidth,
      height: basketHeight,
    };

    setBasket(initialBasket);
  };

  const handleBasket = (): (() => void) | undefined => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rectangle = canvas.getBoundingClientRect();
    const basketWidthOffset = basketWidth / 2;

    const handleMouse = (event: MouseEvent): void => {
      const mouseX = event.clientX - rectangle.left;

      setBasket(
        (previousBasket) =>
          previousBasket && {
            ...previousBasket,
            x: mouseX - basketWidthOffset,
          },
      );
    };

    canvas.addEventListener("mousemove", handleMouse);
    return () => document.removeEventListener("mousemove", handleMouse);
  };

  const updateGame = (): void => {
    setBall((previousBall) => ({
      ...previousBall,
      y: previousBall.y + previousBall.speed,
    }));

    animationRequestId.current = requestAnimationFrame(updateGame);
  };

  const getNewXCoordinate = (): number => {
    if (!canvas) return 0;
    let x: number = getRandomNumber() * canvas.width;

    // make sure ball is fully visible on the left of the canvas
    if (x < initialBall.radius) {
      x = initialBall.radius;
    }

    // make sure ball is fully visible on the right of the canvas
    if (x > canvas.width - initialBall.radius) {
      x = canvas.width - initialBall.radius;
    }

    return x;
  };

  const resetBall = (): void => {
    setBall((previousBall) => ({
      ...initialBall,
      x: getNewXCoordinate(),
      speed: previousBall.speed + 1, // increases speed after every cycle
    }));
  };

  const checkBall = (): void => {
    if (!canvas || !basket || !gameStart) return;

    // if ball hits the basket
    if (
      ball.y + ball.radius >= basket.y &&
      ball.x >= basket.x &&
      ball.x <= basket.x + basket.width
    ) {
      setScore(score + 1);
      resetBall();
    }

    // if ball hits the ground
    if (ball.y >= canvas.height) {
      setGameStart(false);
    }
  };

  const drawObjects = (): void => {
    if (!canvas || !context || !basket) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "beige";
    context.fillRect(basket.x, basket.y, basket.width, basket.height);
    context.drawImage(ballImage, ball.x, ball.y, ball.radius, ball.radius);
  };

  const startGame = (): void => {
    setScore(0);
    setTimer(0);
    setBall(initialBall);
    setGameStart(true);
  };

  useEffect(() => {
    initiateCanvas();
    handleBasket();
  }, []);

  useEffect(() => {
    if (gameStart) {
      drawObjects();
      checkBall();
    }
  }, [gameStart, ball, basket]);

  useEffect(() => {
    let intervalId: number;
    if (gameStart) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStart, timer]);

  useEffect(() => {
    if (gameStart) {
      animationRequestId.current = requestAnimationFrame(updateGame);
    } else {
      if (animationRequestId.current) {
        cancelAnimationFrame(animationRequestId.current);
        animationRequestId.current = null;
      }
    }
  }, [gameStart]);

  return (
    <>
      <canvas ref={canvasRef} />
      <div id="footer">
        <MouseTracker />
        <div id="score" className="footer-item">
          Score: <span>{score}</span>
        </div>
        <div id="timer" className="footer-item">
          Timer: <span>{timer}s</span>
        </div>
        <button onClick={startGame} disabled={gameStart}>
          {gameStart ? "Game started!" : "Start Game"}
        </button>
      </div>

      {/** ball.y starts at 0 on page load indicating the game has not started */}
      {!gameStart && ball.y > 0 && <GameOverAlert />}
    </>
  );
};

export { Canvas };
