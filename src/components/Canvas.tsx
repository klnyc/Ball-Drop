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
  speed: 10, // starting speed
};

const basketWidth = 100;
const basketHeight = 10;

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [basket, setBasket] = useState<Basket>();
  const [ball, setBall] = useState<Ball>(initialBall);
  const [score, setScore] = useState<number>(0);
  const [gameStart, setGameStart] = useState<boolean>(false);

  const ballImage: HTMLImageElement = new Image();
  ballImage.src = ballSvg;

  const initiateCanvas = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // sets canvas dimensions to its parent container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context.fillStyle = "#242424";
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
          }
      );
    };

    canvas.addEventListener("mousemove", handleMouse);
    return () => document.removeEventListener("mousemove", handleMouse);
  };

  const updateGame = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    console.log("update game", gameStart);

    setBall((previousBall) => ({
      ...previousBall,
      y: previousBall.y + previousBall.speed,
    }));

    requestAnimationFrame(updateGame);
  };

  const getNewXCoordinate = (): number => {
    const canvas = canvasRef.current;
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

  const checkBall = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context || !basket) return;

    console.log("check ball");

    // if ball hits the basket
    if (
      ball.y + ball.radius >= basket.y &&
      ball.x >= basket.x &&
      ball.x <= basket.x + basket.width
    ) {
      console.log("hits basket");
      setScore(score + 1);
      resetBall();
    }

    // if ball hits the ground
    if (ball.y >= canvas.height) {
      console.log("you lose");
      setGameStart(false);
    }
  };

  const drawObjects = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context || !basket) return;

    console.log("draw objects");

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "beige";
    context.fillRect(basket.x, basket.y, basket.width, basket.height);
    context.drawImage(ballImage, ball.x, ball.y, ball.radius, ball.radius);
  };

  const startGame = (): void => {
    console.log("start game");
    setScore(0);
    setBall(initialBall);
    setGameStart(true);
  };

  useEffect(initiateCanvas, []);
  useEffect(handleBasket, []);

  useEffect(() => {
    if (gameStart) {
      drawObjects();
      checkBall();
    }
  }, [gameStart, ball, basket]);

  useEffect(() => {
    if (gameStart) {
      requestAnimationFrame(updateGame);
    }
  }, [gameStart]);

  return (
    <>
      <canvas ref={canvasRef} />
      <div id="footer">
        <div id="score" className="footer-item">
          Score: {score}
        </div>
        <button onClick={startGame} disabled={gameStart}>
          {gameStart ? "Game started!" : "Start Game"}
        </button>
        <MouseTracker />
      </div>

      {/** ball.y is 0 on page load */}
      {/** ball.y > 0 indicates that a game has started so the alert doesn't show on page load */}
      {!gameStart && ball.y > 0 && <GameOverAlert />}
    </>
  );
};

export { Canvas };
