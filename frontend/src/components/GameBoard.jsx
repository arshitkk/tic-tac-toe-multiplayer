import { useEffect, useState } from "react";
import Turn from "./mini components/Turn";
import Winner from "./mini components/Winner";
function GameBoard({ socket, roomCode, playerSymbol, startGame }) {
  const [board, setBoard] = useState(Array(9).fill(null)); // 9 boxes
  const [winner, setWinner] = useState(null);
  const [turn, setTurn] = useState("X");
  const [isMyTurn, setIsMyTurn] = useState(true); // check if it's my turn
  const [draw, setDraw] = useState(null);

  const winningCombinations = [
    // Winning rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Winning columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Winning diagonals
    [0, 4, 8],
    [6, 4, 2],
  ];
  const [winnerBoxes, setWinnerBoxes] = useState([]);
  const checkWinner = () => {
    // Go through each winning pattern (rows, columns, diagonals)
    winningCombinations.forEach((arr) => {
      // Destructure the 3 indexes from current winning combination
      let [a, b, c] = arr;

      // Check if all three boxes have the same value (either 'X' or 'O')
      // and none of them is empty (null). That means we have a winner.
      if (board[a] === board[b] && board[b] === board[c] && board[a] !== null) {
        setWinnerBoxes([a, b, c]); // Store the boxes that made the player win (to highlight them)
        setWinner(board[a]); // Set the winner ('X' or 'O') based on the box value
        return; // No need to check further if winner is already found
      }
    });

    // If no winner and no empty boxes left, it means the game is a draw
    if (!board.includes(null)) {
      setDraw(true);
    }
  };
  const gamePlay = (index) => {
    // Only allow gameplay if the game has started
    if (startGame) {

      // Block move if:
      // 1. The selected box is already filled
      // 2. It's not this player's turn
      // 3. Someone already won
      if (board[index] !== null || !isMyTurn || winner) return;

      // Prevent player from clicking if it's not their symbol's turn
      if (playerSymbol !== turn) return;

      // Calculate the next player's symbol for the upcoming turn
      const nextTurn = turn === "X" ? "O" : "X";

      // Update the board state with the current player's symbol at the clicked index
      setBoard((prevBoard) =>
        prevBoard.map((box, idx) => (idx === index ? turn : box))
      );

      // Change the turn to the next player
      setTurn(nextTurn);

      // Inform the server about the move so it can sync it to other players
      socket.emit("playerMove", {
        index: index, // index of the clicked box
        turn: turn, // current player's symbol
        room: roomCode, // which game room this move belongs to
      });

      // Disable the plaayer's tur unntil the next player makes a move
      setIsMyTurn(false);
    }
  };

  return (
    <div>
      {socket && (
        <>
          <div className="flex flex-col justify-center items-center w-full">
            <p className="bg-red-500 text-white p-2 rounded-2xl text-center text-2xl font-bold absolute  top-3">
              Room Code: {roomCode}
            </p>

            <p className="bg-green-700 text-white p-2 rounded-2xl text-center text-xl font-bold absolute top-18">
              You are {playerSymbol}
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-6">
            {!startGame && (
              <p className=" h-80 w-80 bg-black/80 animate-pulse rounded-3xl text-center text-4xl font-bold absolute text-white flex justify-center items-center">
                waiting for opponent...
              </p>
            )}
            {winner || draw ? (
              <Winner winner={winner} draw={draw} />
            ) : (
              <Turn playerSymbol={playerSymbol} turn={turn} />
            )}
            <div className="p-0.5 rounded-4xl bg-black/60 overflow-hidden ">
              <div className=" grid grid-cols-3 shadow-2  overflow-hidden h-fit rounded-4xl">
                {board.map((box, index) => (
                  <div
                    className={` 
              ${
                winner
                  ? winnerBoxes.includes(index)
                    ? "bg-green-500 pointer-events-none"
                    : "bg-white/75 pointer-events-none"
                  : "bg-white/90"
              } 
              hover:scale-95 select-none  hover:bg-blue-200 transition-all cursor-pointer  m-0.5 border-black/30 h-24 w-24 flex justify-center items-center text-6xl ${
                box ? "pointer-events-none opacity-85 " : ""
              }`}
                    onClick={() => gamePlay(index)}
                    key={index}
                  >
                    {box}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={resetGame}
              className={` bg-red-700 cursor-pointer text-xl hover:scale-110 transition-all active:scale-90 text-white font-bold p-1 px-3  rounded-md ${
                winner ? "" : "invisible"
              }`}
            >
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
}
export default GameBoard;
