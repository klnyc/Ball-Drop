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
    inputs.push(
      <input
        type="number"
        onChange={handleChange}
        className={`sudoku-input ${validCells[row][column] && "valid-sudoku-input"}`}
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
