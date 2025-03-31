import "../styles/Canvas.css";
import { useRef, useEffect, useState } from "react";
import { getRandomNumber } from "../utility";

const initialBasket = { x: 150, y: 350, width: 100, height: 20 };
const initialBall = {
  x: getRandomNumber() * 300,
  y: 0,
  width: 30,
  height: 30,
  speed: 0.2,
};

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [basket, setBasket] = useState(initialBasket);
  const [ball, setBall] = useState(initialBall);

  const initiateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    // sets canvas dimensions to its parent container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context.fillStyle = "#242424";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleBasket = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    console.log("handle basket");
    const handleMouse = (event: MouseEvent): void => {
      const rectangle = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rectangle.left;

      setBasket((previousBasket) => ({
        ...previousBasket,
        x: mouseX - previousBasket.width / 2,
      }));
    };

    canvas.addEventListener("mousemove", handleMouse);

    return () => document.removeEventListener("mousemove", handleMouse);
  };

  const updateGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    if (gameOver) return;
    console.log("update");

    const resetBall = () => {
      setBall({ ...initialBall, x: getRandomNumber() * canvas.width });
    };

    setBall((previousBall) => ({
      ...previousBall,
      y: previousBall.y + previousBall.speed,
    }));

    // if ball hits the basket
    if (
      ball.y + ball.height >= basket.y &&
      ball.x >= basket.x &&
      ball.x <= basket.x + basket.width
    ) {
      console.log("hits floor");
      resetBall();
    }

    // if ball hits the ground
    if (ball.y > canvas.height) {
      console.log("you lose");
      setGameOver(true);
    }

    const drawGame = () => {
      console.log("drawing!");

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "blue";
      context.fillRect(basket.x, basket.y, basket.width, basket.height);

      context.fillStyle = "red";
      context.beginPath();
      context.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
      context.fill();
    };

    drawGame();
  };

  const startGame = () => {
    console.log("start game");
    updateGame();
    if (!gameOver) requestAnimationFrame(updateGame);
  };

  useEffect(initiateCanvas, []);
  useEffect(handleBasket, []);

  useEffect(() => {
    if (!gameOver) {
      console.log("about to start");
      startGame();
    }
  }, [handleBasket, updateGame, gameOver]);

  return <canvas ref={canvasRef} />;
};

export { Canvas };
