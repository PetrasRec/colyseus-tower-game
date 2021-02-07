import { Schema, type, MapSchema, SetSchema } from "@colyseus/schema";
import { WARMUP_TIME } from "../../game/constants";
import { AuthUser } from "../AuthUser";
import {GameState} from "../../game/gameState";
enum LobbyState {
  PLAYING = 1,
  FINISHED = 2,
  WAITING_FOR_PLAYERS = 3,
}

export class GameRoomState extends Schema {
  @type("string")
  public title: string;

  @type("number")
  public lobbyState : LobbyState;

  @type(GameState)
  public gameState : GameState;

  // key player id
  @type({ set: "string" })
  public playerSet: SetSchema<string> = new SetSchema<string>();

  // key socker id
  @type ({ map: AuthUser})
  public playerMap: MapSchema<AuthUser> = new MapSchema<AuthUser>();

  @type("number")
  public maxPlayers: number;

  @type("number")
  public warmupTimeSeconds: number;

  @type("string")
  public lobbyOwnerId: string
  constructor(roomTitle: string, lobbyOwnerId: string) {
    super();
    this.title = roomTitle;
    this.lobbyState = LobbyState.WAITING_FOR_PLAYERS;
    this.maxPlayers = 4;
    // Set warmup time in seconds
    this.warmupTimeSeconds = WARMUP_TIME;
  }
  
  onPlayerInput(sessionID: string, data: any) {
      const player : AuthUser = this.playerMap.get(sessionID);
      
  }

  update() {
    this.gameState.update();
  }

  startGame() {
    this.gameState = new GameState(this.playerMap);
  }

  onSecondPassed() {
    if (this.warmupTimeSeconds > 0) {
      this.warmupTimeSeconds--;
    } else {
      this.gameState.onSecondPassed();
    }
  }

  addNewPlayer(player: AuthUser) {
    if (this.playerSet.has(player.id)) {
      throw new Error("You have already joined this lobby");
    }
    if (this.maxPlayers == this.playerMap.size) {
      throw new Error("max player count reached");
    }

    this.playerSet.add(player.socketId);
    this.playerMap.set(player.id, player);
  }

  removePlayer(player: AuthUser) {
    this.playerMap.delete(player.socketId);
    this.playerSet.delete(player.id);
  }

  existsPlayer(playerId: string) {
    return this.playerSet.has(playerId);
  }
}