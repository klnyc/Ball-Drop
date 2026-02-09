import "../Home.css";
import { JSX } from "react";
import { Link } from "react-router";

const Home = (): JSX.Element => {
  return (
    <div id="home-container">
      Home
      <Link to="/balldrop">
        <button>Go to Ball Drop</button>
      </Link>
    </div>
  );
};

export default Home;
