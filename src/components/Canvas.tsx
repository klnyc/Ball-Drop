import "../styles/Canvas.css";
import { useRef, useEffect, useState } from "react";
import { getRandomNumber } from "../utility";

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
  speed: 0.3, // starting speed
};

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [basket, setBasket] = useState<Basket>();
  const [ball, setBall] = useState<Ball>(initialBall);
  const [score, setScore] = useState<number>(0);
  const [gameStart, setGameStart] = useState<boolean>(false);

  const ballImage: HTMLImageElement = new Image();
  ballImage.src = "/react.svg";

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
      width: 100,
      height: 10,
    };

    setBasket(initialBasket);
  };

  const handleBasket = (): (() => void) | undefined => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouse = (event: MouseEvent): void => {
      const rectangle = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rectangle.left;

      setBasket(
        (previousBasket) =>
          previousBasket && {
            ...previousBasket,
            x: mouseX - previousBasket.width / 2,
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
    if (!gameStart || !basket) return;

    console.log("update game");

    const resetBall = (): void => {
      setBall({
        ...initialBall,
        x: getRandomNumber() * canvas.width,
        speed: ball.speed + 0.1, // increases speed after every cycle
      });
    };

    setBall((previousBall) => ({
      ...previousBall,
      y: previousBall.y + previousBall.speed,
    }));

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
    if (ball.y > canvas.height) {
      console.log("you lose");
      setGameStart(false);
    }

    const drawGame = (): void => {
      console.log("draw game");

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "beige";
      context.fillRect(basket.x, basket.y, basket.width, basket.height);

      context.drawImage(ballImage, ball.x, ball.y, ball.radius, ball.radius);
    };

    drawGame();
  };

  const startGame = (): void => {
    console.log("start game");
    updateGame();
    if (gameStart) requestAnimationFrame(updateGame);
  };

  const handleStartGame = () => {
    console.log("handle start game");
    setGameStart(true);
  };

  useEffect(initiateCanvas, []);
  useEffect(handleBasket, []);

  useEffect(() => {
    if (gameStart) {
      startGame();
    }
  }, [handleBasket, updateGame, gameStart]);

  return (
    <>
      <canvas ref={canvasRef} />
      <div id="footer">
        <div id="score">Score: {score}</div>
        <button onClick={handleStartGame}>Start Game</button>
        <div id="">Mouse coordinates</div>
      </div>
    </>
  );
};

export { Canvas };
