const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!!");
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);
  socket.on("message", (data) => {
    console.log(data);
    // io.emit("receiver", data); //aana thi ene pote pan jase ene na mokalvo hoy to aapde niche mujab karsu
    // socket.broadcast.emit("receiver", data);

    //aa niche ni line e batave che ke aapde to pachi bracket ma jeni room id lakhsu jene aapde direct message mokalvo hoy ane tya aapde array of id pan lakhi sakie to tene sidho messsage jato rehse
    io.to(data.room).emit("receiver", data.message);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
  //   socket.emit("welcome", "Welcome to the Server!!");
  //   socket.broadcast.emit("welcome", `${socket.id} Joined Server`);
});

server.listen(8001, (err) => {
  if (!err) {
    console.log("Server is Listening on Port number 8001");
  }
});
