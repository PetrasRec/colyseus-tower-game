import https from "https";
import http from "http";
import express from "express";
import fs from "fs";
import cors from "cors";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
//import socialRoutes from "@colyseus/social/express";

import { GameRoom } from "./rooms/GameRoom";
import { authenticateTokenMiddleware } from "./auth";
import usersRouter from "./routes/users";
import lobbyRouter from "./routes/lobby";

import mongoose from "mongoose";
require('dotenv').config();
const port = Number(process.env.PORT || 2567);
const app = express()

app.use(cors());
app.use(express.json())

var privateKey  = fs.readFileSync('/home/indeform/ssl/emsmarthouse.com.key', 'utf8');
var certificate = fs.readFileSync('/home/indeform/ssl/emsmarthouse.com.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

// const server = http.createServer(app)
const server = https.createServer(credentials, app)

const gameServer = new Server({
  server: server,
  express: app,
  pingInterval: 0,
});

mongoose
  .connect(process.env.MONGO_URI,  {useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=>{console.log("Connected to mongoDB")})
  .catch((e)=>console.log("mongoDB errror:", e));

// register your room handlers
gameServer.define('game_room', GameRoom);
/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/server/authentication/)
 * - also uncomment the import statement
 */
//app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor());

// basic api stuff
app.use("/api/users", usersRouter);
app.use("/api/lobby", lobbyRouter);

app.get("/auth", authenticateTokenMiddleware, (req: any, res: any) => {
  res.send("Haha");
})
gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)
