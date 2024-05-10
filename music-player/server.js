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
const allowedOrigins = process.env.ALLOWED_COMMUNICATION_ORIGINS.split(",");
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
});
server.listen(process.env.MUSIC_PLAYER_PORT || 3000);
console.log("Server is running");

app.get("/", (req, res) => {
  res.send("<h1>Music Player Server</h1>");
});

const player = async (rfidCode, location) => {
  const rfidCodes = await readFromDatabase(process.env.BASEROW_SPOTIFY_CODES_TABLE_ID);
  const selected = rfidCodes.filter((code) => code["rfid-code"] === rfidCode);
  let { spotifyUri, spotifyType } = selected[0];
  spotifyUri = spotifyUri[0].value;
  spotifyType = spotifyType[0].value.value;
  console.log(spotifyUri, spotifyType);

  return makeSonosApiRequest(location, spotifyUri, spotifyType);
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
    const { rfidCode, location } = JSON.parse(message);

    player(rfidCode, location);
    console.log("Message is received :", message);
  });
});
