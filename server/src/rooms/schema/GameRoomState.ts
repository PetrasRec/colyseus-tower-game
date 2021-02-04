import { Schema, type, MapSchema } from "@colyseus/schema";
import { GameState } from "../../game/GameState";
import { Player } from "../Player";
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

  @type({ map: Player })
  public playerMap: MapSchema<Player>;

  @type("number")
  public maxPlayers: number;

  @type("string")
  public lobbyOwnerId: string
  constructor(roomTitle: string, lobbyOwnerId: string) {
    super();
    this.title = roomTitle;
    this.lobbyState = LobbyState.WAITING_FOR_PLAYERS;
    this.maxPlayers = 4;
    this.playerMap = new MapSchema<Player>();
    this.gameState = new GameState();
  }
  
  addNewPlayer(player: Player) {
    if (this.playerMap.has(player.id)) {
      throw new Error("You have already joined this lobby");
    }
    if (this.maxPlayers == this.playerMap.size) {
      throw new Error("max player count reached");
    }

    this.playerMap.set(player.id, player);
  }

  removePlayer(player: Player) {
    this.playerMap.delete(player.id);
  }

  existsPlayer(playerId: string) {
    return this.playerMap.has(playerId);
  }
}