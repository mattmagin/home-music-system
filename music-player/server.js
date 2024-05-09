import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { config } from "dotenv";

import makeSonosApiRequest from "./makeSonosApiRequest.js";
import readFromDatabase from "./readFromDatabase.js";

config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
});
const PORT = 3000;
server.listen(PORT);
console.log("Server is running");

app.get("/", (req, res) => {
  res.send("<h1>Music Player Server</h1>");
});

const player = async (rfidCode) => {
  const rfidCodes = await readFromDatabase(process.env.SPOTIFY_CODES_TABLE_ID);
  const selected = rfidCodes.filter((code) => code["rfid-code"] === rfidCode);
  let { spotifyUri, spotifyType } = selected[0];
  spotifyUri = spotifyUri[0].value;
  spotifyType = spotifyType[0].value.value;
  console.log(spotifyUri, spotifyType);

  return makeSonosApiRequest("Living%20Room", spotifyUri, spotifyType);
};

const connections = [];

io.sockets.on("connection", (socket) => {
  // console.log(socket);
  connections.push(socket);
  console.log(" %s sockets is connected", connections.length);

  socket.on("disconnect", () => {
    connections.splice(connections.indexOf(socket), 1);
  });

  socket.on("rfidCode", (message) => {
    player(message);
    console.log("Message is received :", message);
  });
});
