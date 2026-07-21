import { Link } from "react-router";

interface BackToPlayboxButtonProps {
  color?: "purple" | "coral";
}

const BackToPlayboxButton = ({ color = "coral" }: BackToPlayboxButtonProps) => {
  return (
    <Link to="/">
      <button className={`back-to-playbox-button ${color}`}>
        Back to Playbox
      </button>
    </Link>
  );
};

export default BackToPlayboxButton;
