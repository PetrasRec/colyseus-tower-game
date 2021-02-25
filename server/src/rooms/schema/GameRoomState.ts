import { Schema, type, MapSchema, SetSchema } from "@colyseus/schema";
import { WARMUP_TIME } from "../../game/constants";
import { AuthUser } from "../AuthUser";
import { GameState, GameStateEnum } from "../../game/gameState";
import { PlayerStats } from "../../models/PlayerStats";
import { Lobby } from "../../models/Lobby";

enum LobbyState {
  PLAYING = 1,
  FINISHED = 2,
  WAITING_FOR_PLAYERS = 3,
}

enum ControllerTypes {
  KEYBOARD= 0,
  WEBCAM= 1,
};

export class GameRoomState extends Schema {
  @type("string")
  public title: string;

  @type("string")
  public roomId: string;

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

  @type("number")
  public controllerType: ControllerTypes;

  @type("string")
  public lobbyOwnerId: string
  constructor(roomTitle: string, controllerId: ControllerTypes, lobbyOwnerId: string, roomId: string) {
    super();
    this.title = roomTitle;
    this.lobbyState = LobbyState.WAITING_FOR_PLAYERS;
    this.maxPlayers = 4;
    this.controllerType = controllerId;
    // Set warmup time in seconds
    this.warmupTimeSeconds = WARMUP_TIME;
    this.roomId = roomId;
  }
  
  onPlayerInput(sessionID: string, data: number[]) {
      if (this.warmupTimeSeconds > 0) {
        return;
      }
      const player : AuthUser = this.playerMap.get(sessionID);
      if (player === null || player === undefined) {
        return;
      }
      this.gameState.onPlayerInput(player, data);
  }

  async update() {
    
    if (this.gameState.enumState === GameStateEnum.WIN_STATE) {
      if (this.lobbyState !== LobbyState.FINISHED) {
        console.log("GAME FINISHED!");
        this.lobbyState = LobbyState.FINISHED;
        // Save to mongo db game state stuff
        const winnerPlayer = this.gameState.getWinnerPlayer();
        let playerStats = [];

        for (let player of this.gameState.players) {
          if (player.authUser) {
            const p = new PlayerStats({
                user_id: player?.authUser?.id,
                room_id: this.roomId,
                total_damage: player.damageDone,
                total_kills: player.totalKills,
                health_left: player.components.cannonInfoDisplay.hp,
            });
            await p.save();
            playerStats.push(p);
          }
        }
        
        // after this create a lobby instance in mongoDB
        const lobby = new Lobby({
            room_id: this.roomId,
            winner_user_id: winnerPlayer.authUser.id,
        });
        await lobby.save();
      }

      if (this.gameState.endScreenTime <= 0) {
        return; // No more game state updates after this.
      }
    }
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

    this.playerSet.add(player.id);
    this.playerMap.set(player.socketId, player);
  }

  removePlayer(player: AuthUser) {
    this.playerMap.delete(player.socketId);
    this.playerSet.delete(player.id);
  }

  existsPlayer(playerId: string) {
    return this.playerSet.has(playerId);
  }
}