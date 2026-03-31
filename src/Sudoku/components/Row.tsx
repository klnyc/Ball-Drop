import { ChangeEvent, ReactElement, useContext } from "react";
import { SudokuContext } from "./Sudoku";

interface RowProps {
  row: number;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const Row = ({ row, handleChange }: RowProps) => {
  const { grid, validCells } = useContext(SudokuContext);

  if (!validCells || !grid) return <></>;

  const inputs: ReactElement[] = [];
  for (let column = 1; column <= 9; column++) {
    const name: string = `${row}-${column}`;

    const hasBackgroundColor =
      (row <= 3 && column <= 3) || // top left subgrid
      (row <= 3 && column >= 7) || // top right subgrid
      (row >= 4 && row <= 6 && column >= 4 && column <= 6) || // middle subgrid
      (row >= 7 && column <= 3) || // bottom left subgrid
      (row >= 7 && column >= 7); // bottom right subgrid

    inputs.push(
      <input
        type="number"
        onChange={handleChange}
        className={`sudoku-input ${validCells[row][column] && "valid-sudoku-input"} ${hasBackgroundColor && "sudoku-input-background"}`}
        name={name}
        key={name}
        value={grid[row][column] || ""}
        onKeyDown={(event) =>
          // prevents these keys from inputting numbers
          ["e", "E", "+", "-"].includes(event.key) && event.preventDefault()
        }
      />,
    );
  }
  return <div key={`row-${row}`}>{inputs}</div>;
};
