import { useEffect, useState } from "react";

interface GameOverAlertProps {
  text: string;
}

const FlashAlert = ({ text }: GameOverAlertProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const duration = 2_000; // match CSS pulse animation duration

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return isVisible ? <div className="flash-alert">{text}</div> : <></>;
};

export { FlashAlert };
