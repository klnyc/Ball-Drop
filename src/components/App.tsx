import "../styles/App.css";
import { useState } from "react";
import { Canvas } from "./Canvas";

function App() {
  const [score, setScore] = useState<number>(0);

  return (
    <div id="app">
      <Canvas score={score} setScore={setScore} />
      <div id="score">Score: {score}</div>
    </div>
  );
}

export default App;
