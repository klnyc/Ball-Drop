import { Link } from "react-router";

const Home = () => {
  return (
    <div className="home-container">
      <div className="playbox-title">Playbox</div>
      <Link to="/balldrop" className="game-link">
        <button>Ball Drop</button>
      </Link>
      <Link to="/fruitpop" className="game-link">
        <button>Fruit Pop</button>
      </Link>
      <Link to="/dogjump" className="game-link">
        <button>Dog Jump</button>
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
