import { type ChangeEvent, FormEvent, useState } from "react";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";

const Tabler = () => {
  const [rows, setRows] = useState<number | string>("");
  const [columns, setColumns] = useState<number | string>("");
  const [table, setTable] = useState<string[][]>([]);
  const [submitError, setSubmitError] = useState<string>("");

  const rowsOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setRows("");
    } else if (!isNaN(Number(value))) {
      setRows(Number(value));
    }
  };

  const columnsOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setColumns("");
    } else if (!isNaN(Number(value))) {
      setColumns(Number(value));
    }
  };

  const onSubmit = (event: FormEvent) => {
    event?.preventDefault();

    if (typeof rows === "string" || typeof columns === "string") {
      setSubmitError("Number must be between 1 and 10");
      return;
    }

    const newRow = Array(columns).fill("");
    const newTable = Array(rows).fill(newRow);
    setTable(newTable);
    setSubmitError("");
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
        <div className="tabler-form-input">
          <span className="tabler-form-input-label">Rows:</span>
          <input
            name="rows"
            type="number"
            value={rows}
            onChange={rowsOnChange}
            min={1}
            max={10}
          />
        </div>
        <div className="tabler-form-input">
          <span className="tabler-form-input-label">Columns:</span>
          <input
            name="columns"
            type="number"
            value={columns}
            onChange={columnsOnChange}
            min={1}
            max={10}
          />
        </div>

        <div className="tabler-error">{submitError}</div>

        <button className="tabler-create-button" type="submit">
          Create table
        </button>
      </form>

      {table.length > 0 && (
        <div className="tabler-table">
          <table>
            <tbody className="tabler-table-body">
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Tabler;
