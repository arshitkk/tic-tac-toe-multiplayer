import GameBoard from "./GameBoard";
import io from "socket.io-client";
import { useEffect, useState } from "react";
function EnterGame() {
  const [enterGame, setEnterGame] = useState(false); // To show the game board UI
  const [socket, setSocket] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [startGame, setStartGame] = useState(false); // To start the game
  const [roomCode, setRoomCode] = useState(""); // To save the room code
  const [playerSymbol, setPlayerSymbol] = useState(""); // To save the player symbol
  useEffect(() => {
    const socket = io("https://tic-tac-toe-multiplayer-a57i.onrender.com");
    setSocket(socket);
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  const joinGame = () => {
    if (joinCode === "") {
      alert("Please enter a valid room code");
    } else {
      socket.emit("joinGame", joinCode);
      setRoomCode(joinCode); // Save the room code for board
    }
  };

  const createGame = () => {
    const code = Date.now().toString(36).toUpperCase(); // Generate a random room code
    setRoomCode(code);
    socket.emit("createGame", code); // Emit the event to server to create a new game
  };

  useEffect(() => {
    if (!socket) return; // If socket is not initialized, return

    // server tell us game joinin got failed
    socket.on("failedJoin", () => {
      alert("Room does not exist");
    });

    // Successfully joined a room and received our symbol ("X" or "O")
    socket.on("roomJoined", ({ symbol }) => {
      console.log("📢 roomJoined:", symbol);
      setPlayerSymbol(symbol);
      setEnterGame(true);
    });

    // if start game event is received from server then start the Game
    socket.on("startGame", () => {
      setStartGame(true);
    });

    // Clean up the event listeners
    return () => {
      socket.off("roomJoined");
      socket.off("startGame");
    };
  }, [socket]);

  return (
    <>
      {!enterGame ? (
        <div className="flex flex-col items-center gap-4">
          <button
            className="bg-blue-600 border border-white text-white p-3 shadow-2xl cursor-pointer select-none active:scale-95 rounded-xl font-bold text-2xl  transition"
            onClick={createGame}
          >
            Create Game
          </button>
          <p className=" font-bold text-2xl my-6">OR</p>
          <div className="flex flex-col items-center gap-2">
            <input
              className="bg-blue-500 border w-[18rem] border-black/90 text-white p-2 shadow-2xl active:scale-95 rounded-xl font-bold text-2xl text-center transition"
              type="text"
              placeholder="Enter Game Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <button
              className="bg-blue-600 border border-white text-white p-3 shadow-2xl cursor-pointer select-none active:scale-95 rounded-xl font-bold text-xl  transition"
              onClick={joinGame}
            >
              Join Game
            </button>
          </div>
        </div>
      ) : (
        socket && (
          <GameBoard
            socket={socket}
            roomCode={roomCode}
            playerSymbol={playerSymbol}
            startGame={startGame}
          />
        )
      )}
    </>
  );
}

export default EnterGame;
