import { JSX } from "react";
import { HashRouter, Routes, Route } from "react-router";
import Home from "./Home/components/Home";
import BallDrop from "./BallDrop/components/BallDrop";

const App = (): JSX.Element => {
  return (
    <div id="app">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/balldrop" element={<BallDrop />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
