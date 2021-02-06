import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import Player from "./Player";
import Entity from "./entity";
import Tower from "./Tower";
import CameraControls from "./CameraControls";
import AmbientLight from "./AmbientLight";
import Terrain from "./Terrain";
import DirectionalLight from "./DirectionalLight";
import Position from "./position";
import MapLoader from "./gameMapLoader";
import { AuthUser } from "../rooms/AuthUser";
import { load } from "dotenv/types";
import { TURN_TIME } from "./constants";

export class GameState extends Schema {
  @type([Entity])
  entities: ArraySchema<Entity>;

  @type([Player])
  players: ArraySchema<Player>;

  @type(CameraControls)
  camera: CameraControls;

  @type({map: "number" })
  public entityIDs: MapSchema<number>;

  @type("number")
  public playerTurnIndex: number;

  @type("number")
  public turnTime: number;

  constructor(usersJoined: MapSchema<AuthUser>) {
    super();
    const loadedMapData = MapLoader("Badwater")
    this.entities = loadedMapData.entities;
    this.players = loadedMapData.players;
    this.camera = loadedMapData.camera;

    this.assignPlayersToUsersJoined(usersJoined);
    this.playerTurnIndex = -1;
    this.setNextPlayerTurn();
  }

  assignPlayersToUsersJoined(usersJoined: MapSchema<AuthUser>) {
    let index = 0;
    for (let player of usersJoined.values()) {
      if (index >= this.players.length) {
        break;
      }
      this.players[index].assignAuthUser(player);
      index++;
    }
  }

  onSecondPassed() {
    // Reduce turn time
    this.turnTime--;
  }

  update() {
    // Update game entities
    this.entities.forEach(e => e.update());
    // TODO: collisions ? DAMAGE PLAYERS etc.

    // Skip current player's turn
    if (this.turnTime <= 0) {
      this.setNextPlayerTurn();
    }
  }

  onPlayerInput(user: AuthUser, input: any) {
    const player = this.players.find((p) => p?.authUser?.id == user?.id);
    if (player == null || player == undefined) {
      return;
    }
    // Do some kind of switch and change cannon pitch / yaw or fire based on input
  }

  setNextPlayerTurn() {
    this.playerTurnIndex = (this.playerTurnIndex + 1) % this.players.length;
    this.turnTime = TURN_TIME;
    // Switch camera to target current player.
    const player = this.players[this.playerTurnIndex]; 
  }


}