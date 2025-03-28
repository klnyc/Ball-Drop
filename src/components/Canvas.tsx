import "../styles/Canvas.css";
import { useRef, useEffect, useState } from "react";

const initialbasket = { x: 150, y: 350, width: 100, height: 20 };

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [basket, setBasket] = useState(initialbasket);

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

    context.fillStyle = "blue";
    context.fillRect(basket.x, basket.y, basket.width, basket.height);

    context.fillStyle = "red";
    context.beginPath();
    context.arc(Math.random() * 300, 0, 10, 0, Math.PI * 2);
    context.fill();

    const handleMouse = (event: MouseEvent): void => {
      const rectangle = canvas?.getBoundingClientRect();
      const mouseX = event.clientX - rectangle.left;

      setBasket((previousBasket) => ({
        ...previousBasket,
        x: mouseX - previousBasket.width / 2,
      }));
    };

    canvas.addEventListener("mousemove", handleMouse);

    return () => document.removeEventListener("mousemove", handleMouse);
  };

  useEffect(initiateCanvas, [basket]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
