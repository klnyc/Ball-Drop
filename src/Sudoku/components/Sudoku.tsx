import { useState, createContext, Dispatch, SetStateAction, JSX } from "react";
import { Link } from "react-router";
import Grid from "./Grid";
import Modal from "../../common/components/Modal";

interface GridState {
  [row: number]: {
    [column: number]: number;
  };
}

export interface ValidCells {
  [row: number]: {
    [column: number]: boolean;
  };
}

interface SudokuContextType {
  grid: GridState | undefined;
  setGrid: Dispatch<SetStateAction<GridState | undefined>>;
  validCells: ValidCells | undefined;
  setValidCells: Dispatch<SetStateAction<ValidCells | undefined>>;
  initializeGrid: () => void;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  reset: () => void;
}

const SudokuContext = createContext<SudokuContextType>({
  grid: undefined,
  setGrid: () => {},
  validCells: undefined,
  setValidCells: () => {},
  initializeGrid: () => {},
  message: "",
  setMessage: () => {},
  reset: () => {},
});

const Sudoku = (): JSX.Element => {
  const [grid, setGrid] = useState<GridState>();
  const [validCells, setValidCells] = useState<ValidCells>();
  const [message, setMessage] = useState<string>("");
  const [showHowToPlayModal, setShowHowToPlayModal] = useState<boolean>(false);

  const sudokuDescription = `Sudoku is a number-placement puzzle. The goal is to fill the 9x9 grid
    with digits so that each column, each row, and each of the nine 3x3
    subgrids contain all of the digits from 1 to 9 exactly once. Do not
    enter any other characters, only numbers are accepted.`;

  const initializeGrid = (): void => {
    const defaultGrid: GridState = {};
    const defaultValidCells: ValidCells = {};

    for (let row = 1; row <= 9; row++) {
      defaultGrid[row] = {};
      defaultValidCells[row] = {};
      for (let column = 1; column <= 9; column++) {
        defaultGrid[row][column] = 0;
        defaultValidCells[row][column] = false;
      }
    }
    setGrid(defaultGrid);
    setValidCells(defaultValidCells);
  };

  const reset = (): void => {
    setMessage("");
    initializeGrid();
  };

  const sudokuContext: SudokuContextType = {
    grid,
    setGrid,
    validCells,
    setValidCells,
    initializeGrid,
    message,
    setMessage,
    reset,
  };

  return (
    <div id="sudoku-container">
      <SudokuContext.Provider value={sudokuContext}>
        <div id="sudoku-warning-message">{message}</div>
        <Grid />
        <Link to="/">
          <button className="back-to-playbox-button">Back to Playbox</button>
        </Link>
        <button id="reset-sudoku-button" onClick={reset}>
          Reset
        </button>
        <button
          className="how-to-play-button"
          onClick={() => setShowHowToPlayModal(true)}
        >
          How to play
        </button>

        {showHowToPlayModal && (
          <Modal
            text={sudokuDescription}
            onClose={() => setShowHowToPlayModal(false)}
          />
        )}
      </SudokuContext.Provider>
    </div>
  );
};

export { Sudoku, SudokuContext };
export default Sudoku;
