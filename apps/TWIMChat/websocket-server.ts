import { Server } from "socket.io";

const PORT = 4000;

let waitingUsers: string[] = [];

const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from your Next.js app
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("user joined", () => {
    console.log("User joined:", socket.id);
    waitingUsers.push(socket.id);
  });

  socket.on("looking for pair", () => {
    // Pairing logic
    if (waitingUsers.length > 0) {
      const partner = waitingUsers.shift(); // Remove the first user from the queue
      if (partner) {
        const room = `room_${Date.now()}`;

        socket.join(room);

        const partnerSocket = io.sockets.sockets.get(partner);
        if (partnerSocket) {
          partnerSocket.join(room);

          io.to(room).emit("paired", { room });
          io.to(room).emit("chat message", "You are now connected with a stranger!");
        } else {
          // Handle the case where the partner disconnects before pairing
          console.log("Partner socket not found. Adding the user back to the queue.");
          waitingUsers.push(socket.id);
        }
      }
    } else {
      waitingUsers.push(socket.id);
    }
  });

  socket.on("leave room", (roomId) => {
    socket.leave(roomId);
  });

  socket.on("chat message", (msg) => {
    const [room] = Array.from(socket.rooms).filter((r) => r !== socket.id);
    if (room) {
      socket.to(room).emit("chat message", msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    waitingUsers = waitingUsers.filter((id) => id !== socket.id);

    const [room] = Array.from(socket.rooms).filter((r) => r !== socket.id);
    if (room) {
      socket.to(room).emit("chat message", "Your chat partner has disconnected.");
    }
  });
});
