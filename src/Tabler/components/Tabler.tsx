import { type ChangeEvent, FormEvent, useState } from "react";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";

// can't delete

const Tabler = () => {
  const [rows, setRows] = useState<number>();
  const [columns, setColumns] = useState<number>();
  const [table, setTable] = useState<string[][]>([]);

  const rowsOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(event.target.value))) {
      setRows(Number(event.target.value));
    }
  };

  const columnsOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(event.target.value))) {
      setColumns(Number(event.target.value));
    }
  };

  const onSubmit = (event: FormEvent) => {
    event?.preventDefault();

    if (!rows || !columns || rows < 1 || columns < 1) {
      return;
    }

    const newRow = Array(columns).fill("");
    const newTable = Array(rows).fill(newRow);
    setTable(newTable);
  };

  const onInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    columnIndex: number,
  ) => {
    const newTable = table.map((row) => [...row]);
    newTable[rowIndex][columnIndex] = event.target.value;
    setTable(newTable);
  };

  return (
    <div className="tabler-container">
      <div className="tabler-header">
        <BackToPlayboxButton />
      </div>

      <form className="tabler-form" onSubmit={onSubmit}>
        <div>
          Rows:
          <input
            name="rows"
            type="number"
            value={rows}
            onChange={rowsOnChange}
            min={1}
            max={100}
          />
        </div>

        <div>
          Columns:
          <input
            name="columns"
            type="number"
            value={columns}
            onChange={columnsOnChange}
            min={1}
            max={100}
          />
        </div>

        <button type="submit">Create table</button>
      </form>

      {table.length > 0 && (
        <div className="tabler-table">
          {table.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {row.map((_, columnIndex) => (
                  <td key={`${rowIndex}-${columnIndex}`}>
                    <input
                      value={table[rowIndex][columnIndex]}
                      onChange={(event) =>
                        onInputChange(event, rowIndex, columnIndex)
                      }
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tabler;
