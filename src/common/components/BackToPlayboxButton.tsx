import { Link } from "react-router";

const BackToPlayboxButton = () => {
  return (
    <Link to="/">
      <button className="back-to-playbox-button">Back to Playbox</button>
    </Link>
  );
};

export default BackToPlayboxButton;
