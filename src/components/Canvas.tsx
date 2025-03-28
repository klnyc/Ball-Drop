import "../styles/Canvas.css";
import { useRef, useEffect } from "react";

const basket = { x: 150, y: 350, width: 100, height: 20 };

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initiateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // sets canvas dimensions to its parent container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "#242424";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "blue";
    context.fillRect(basket.x, basket.y, basket.width, basket.height);

    context.fillStyle = "red";
    context.beginPath();
    context.arc(Math.random() * 300, 0, 10, 0, Math.PI * 2);
    context.fill();
  };

  useEffect(initiateCanvas, []);
  useEffect(drawGame, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouse = (event: MouseEvent): void => {
      const rectangle = canvas?.getBoundingClientRect();
      const mouseX = event.clientX - rectangle.left;
      basket.x = mouseX - basket.width / 2;
    };

    canvas.addEventListener("mousemove", handleMouse);

    return () => document.removeEventListener("mousemove", handleMouse);
  }, []);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
