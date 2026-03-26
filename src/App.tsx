import { HashRouter, Routes, Route } from "react-router";
import Home from "./Home/components/Home";
import BallDrop from "./BallDrop/components/BallDrop";
import Sudoku from "./Sudoku/components/Sudoku";
import SecretWord from "./SecretWord/components/SecretWord";

const App = () => {
  return (
    <div id="app">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/balldrop" element={<BallDrop />} />
          <Route path="/sudoku" element={<Sudoku />} />
          <Route path="/secretword" element={<SecretWord />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
