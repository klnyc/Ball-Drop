import { useEffect, useState } from "react";
import BackToPlayboxButton from "../../common/components/BackToPlayboxButton";
import Modal from "../../common/components/Modal";

type TripleConnectCell = "X" | "O" | null;

const TripleConnect = () => {
  const [isXTurn, setIsXTurn] = useState<boolean>(true);
  const [board, setBoard] = useState<TripleConnectCell[]>(Array(9).fill(null));
  const [winner, setWinner] = useState<TripleConnectCell>();

  const solutions: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    checkWinner();
  }, [board]);

  // check if any of the possible solutions exist on the board
  const checkWinner = () => {
    for (let i = 0; i < solutions.length; i++) {
      const solution = solutions[i];
      if (
        board[solution[0]] !== null &&
        board[solution[0]] === board[solution[1]] &&
        board[solution[1]] === board[solution[2]]
      ) {
        setWinner(board[solution[0]]);
        return;
      }
    }

    // if all cells are null, it's a draw
    const nullCells = board.filter((cell) => cell === null);
    if (nullCells.length === 0) setWinner(null);
  };

  const handleCellClick = (index: number) => {
    if (!board[index] === null) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(undefined);
  };

  return (
    <div className="triple-connect-container">
      <div className="triple-connect-board">
        {board.map((cell, index) => (
          <button
            className={`triple-connect-cell ${cell ? "clicked" : "unclicked"}`}
            key={index}
            onClick={() => handleCellClick(index)}
          >
            {cell || "?"}
          </button>
        ))}
      </div>
      <div className="triple-connect-footer">
        <BackToPlayboxButton />
      </div>

      {winner !== undefined && (
        <Modal
          classNames="game-over"
          title={winner ? `${winner} wins!` : "Draw!"}
          content={
            <>
              <button
                className="triple-connect-play-again-button"
                onClick={reset}
              >
                Play again
              </button>
              <BackToPlayboxButton />
            </>
          }
        />
      )}
    </div>
  );
};

export default TripleConnect;
