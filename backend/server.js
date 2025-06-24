const http = require("http");
const { Server } = require("socket.io");

const httpServer = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Socket server is running 🚀");
});

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://tic-tac-toe-khelo.vercel.app"],
  },
});

io.on("connection", (socket) => {
  console.log("connected");

  // Create Game Room
  socket.on("createGame", (code) => {
    socket.join(code); //  create and join the room
    console.log(`${code} created a Game Room`);
    socket.emit("roomJoined", { symbol: "X" }); // first player is X
  });

  // Join Game Room
  socket.on("joinGame", (code) => {
    const room = io.sockets.adapter.rooms.get(code); // get the room

    // check if room  exists and is not full
    if (room && room.size === 1) {
      socket.join(code); // join the game room
      console.log(`A Player joined ${code}'s game`);
      socket.emit("roomJoined", { symbol: "O" }); // second player is O
      io.to(code).emit("startGame"); // send start game event to both of them
    } else {
      socket.emit("failedJoin"); // send failed join event
    }
  });

  // Gameplay
  socket.on("playerMove", (data) => {
    io.to(data.room).emit("playerMove", data); // broadcast the player move event to both of them
  });

  // reset game
  socket.on("resetGame", (room) => {
    io.to(room).emit("resetGame"); // broadcast the reset game event to both of them
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("listening on port 3000");
});
