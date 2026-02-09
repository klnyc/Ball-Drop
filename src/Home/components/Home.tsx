import "../Home.css";
import { JSX } from "react";
import { Link } from "react-router";

const Home = (): JSX.Element => {
  return (
    <div id="home-container">
      <div id="playbox-title">Playbox</div>
      <Link to="/balldrop" className="game-link">
        <button>Ball Drop</button>
      </Link>
      <Link to="/sudoku" className="game-link">
        <button>Sudoku</button>
      </Link>
    </div>
  );
};

export default Home;
