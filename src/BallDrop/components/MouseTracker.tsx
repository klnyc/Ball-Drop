import { useEffect, useState } from "react";

export const MouseTracker = () => {
  const [coordinates, setCoordinates] = useState<[number, number]>([0, 0]);
  const [x, y] = coordinates;
  const [isLargerX, setIsLargerX] = useState<boolean>(false);

  useEffect(() => {
    const getMouseCoordinates = (event: MouseEvent): void => {
      const x = event.clientX;
      const y = event.clientY;
      setCoordinates([x, y]);
      setIsLargerX(x > y);
    };

    document.addEventListener("mousemove", getMouseCoordinates);

    return () => document.removeEventListener("mousemove", getMouseCoordinates);
  }, []);

  return (
    <div className="mouse-tracker footer-item">
      <div>Mouse coordinates:</div>
      <span className={isLargerX ? "larger-coordinate" : "smaller-coordinate"}>
        {x},
      </span>
      <span className={isLargerX ? "smaller-coordinate" : "larger-coordinate"}>
        {y}
      </span>
    </div>
  );
};
