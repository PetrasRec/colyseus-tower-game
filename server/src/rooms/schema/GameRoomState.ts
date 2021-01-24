import { Schema, type } from "@colyseus/schema";
import { GameState } from "./GameState";

enum LobbyState {
  PLAYING = 1,
  FINISHED = 2,
  WAITING_FOR_PLAYERS = 3,
}

export class GameRoomState extends Schema {
  @type("string")
  title: string;

  @type("number")
  lobbyState : LobbyState;

  @type(GameState)
  gameState : GameState;

  constructor(roomTitle: string) {
    super();
    this.title = roomTitle;
    this.lobbyState = LobbyState.WAITING_FOR_PLAYERS;
  }
  
}