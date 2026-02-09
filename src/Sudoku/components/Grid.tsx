import { ChangeEvent, useEffect, useContext, JSX } from "react";
import { SudokuContext } from "./Sudoku";
import { Row } from "./Row";

const Grid = (): JSX.Element => {
  const {
    grid,
    setGrid,
    validCells,
    setValidCells,
    initializeGrid,
    setMessage,
  } = useContext(SudokuContext);

  const isValidNumber = (number: number): boolean => number >= 1 && number <= 9;

  const isValidCell = (
    row: number,
    column: number,
    number: number,
  ): boolean => {
    if (!grid) return false;

    for (let i = 1; i <= 9; i++) {
      // Validate if number already exists in the row
      if (i !== column && grid[row][i] === number) return false;

      // Validate if number already exists in the column
      if (i !== row && grid[i][column] === number) return false;

      // Validate if number already exists in the 3x3 sub grid
      const getSubGridStartingCell = (number: number): number =>
        Math.floor((number - 1) / 3) * 3 + 1;

      const startRow = getSubGridStartingCell(row);
      const startColumn = getSubGridStartingCell(column);

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // skip current cell
          if (startRow + i === row && startColumn + j === column) {
            continue;
          }
          // check all other cells in sub grid
          if (grid[startRow + i][startColumn + j] === number) {
            return false;
          }
        }
      }
    }

    return true;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!grid || !validCells) return;
    const newValidCells = { ...validCells };
    const { name, value } = event.target;
    const [row, column] = name.split("-");
    const rowKey = parseInt(row);
    const columnKey = parseInt(column);
    const input = parseInt(value);

    const updatedGrid = { ...grid };
    updatedGrid[rowKey][columnKey] = input;
    setGrid(updatedGrid);

    if (isValidNumber(input) || !input) {
      setMessage("");

      if (!input) {
        newValidCells[rowKey][columnKey] = false;
      }

      if (input && isValidCell(rowKey, columnKey, input)) {
        newValidCells[rowKey][columnKey] = true;
      } else {
        newValidCells[rowKey][columnKey] = false;
      }
    } else {
      setMessage("Please enter a number from 1 to 9");
      newValidCells[rowKey][columnKey] = false;
    }
    setValidCells(newValidCells);
  };

  useEffect(initializeGrid, []);

  const rows = [];

  for (let row = 1; row <= 9; row++) {
    rows.push(<Row row={row} handleChange={handleChange} key={row} />);
  }

  return <div id="sudoku-grid">{rows}</div>;
};

export default Grid;
