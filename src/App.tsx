import { HashRouter, Routes, Route } from "react-router";
import Home from "./Home/components/Home";
import BallDrop from "./BallDrop/components/BallDrop";
import Sudoku from "./Sudoku/components/Sudoku";
import Elevator from "./Elevator/components/Elevator";
import FruitPop from "./FruitPop/components/FruitPop";
import DogJump from "./DogJump/components/DogJump";
import Lister from "./Lister/components/Lister";
import Weather from "./Weather/components/Weather";
import Tabler from "./Tabler/components/Tabler";
import Triplets from "./Triplets/components/Triplets";
import Throttle from "./Throttle/components/Throttle";
import Animals from "./Animals/components/Animals";
import Timer from "./Timer/components/Timer";

const App = () => {
  return (
    <div id="app">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/balldrop" element={<BallDrop />} />
          <Route path="/fruitpop" element={<FruitPop />} />
          <Route path="/dogjump" element={<DogJump />} />
          <Route path="/sudoku" element={<Sudoku />} />
          <Route path="/elevator" element={<Elevator />} />
          <Route path="/lister" element={<Lister />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/triplets" element={<Triplets />} />
          <Route path="/tabler" element={<Tabler />} />
          <Route path="/throttle" element={<Throttle />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/timer" element={<Timer />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
