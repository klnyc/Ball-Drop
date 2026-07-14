import { Link } from "react-router";

const Home = () => {
  return (
    <div id="home-container">
      <div id="playbox-title">Playbox</div>
      <Link to="/balldrop" className="game-link">
        <button>Ball Drop</button>
      </Link>
      <Link to="/sudoku" className="game-link">
        <button>Sudoku</button>
      </Link>
      <Link to="/elevator" className="game-link">
        <button>Elevator</button>
      </Link>
    </div>
  );
};

export default Home;
