import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import { Player, PlayerMove } from "./Player";
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
import Projectile from "./Projectile";

enum GameStateEnum {
  PLAYER_MOVE = 0,
  SWITCH_PLAYER = 1,
  BALL_CAM = 2,
}


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

  @type("number")
  public enumState: GameStateEnum;
  // This is kinda dumb, but this var represents a state after a players shoots a ball.
  // You have to wait till the ball hits the target or is deleted.
  @type("boolean")
  public waitingForMoveToFinish: boolean = false;

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
    //this.turnTime--;
    console.log(this.turnTime);
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

  shoot(player: Player) {
    // where the bulelt should be spawned
    const ballPosition = new Position(player.position.x, player.position.y + 1.1, player.position.z);
    // calculate its trajectory
    const { yaw, pitch } = player.components.cannonController;
    const vx = -Math.cos(yaw) * Math.cos(pitch);
    const vy = Math.sin(-pitch);
    const vz = Math.sin(yaw) * Math.cos(pitch);
    const ballVector = new Position(vx, vy, vz);
    this.entities.push(new Projectile(ballPosition, ballVector, 1))
    this.enumState = GameStateEnum.BALL_CAM
  }

  onPlayerInput(user: AuthUser, inputs: number[]) {
    let player = this.players[this.playerTurnIndex];

    if (player.authUser === null || player.authUser === undefined) {
      return;
    }
    if (player.authUser.id !== user.id) {
      return;
    }

    for (let keyCode of inputs) {
      if (keyCode === PlayerMove.SHOOT) {
        if (this.enumState !== GameStateEnum.PLAYER_MOVE) {
         // continue;
        }
        // Shoot and after a hit switch Player turn
        this.shoot(player);
      } else {
        player.onMove(keyCode);
      }
    }
  }

  setNextPlayerTurn() {
    this.playerTurnIndex = (this.playerTurnIndex + 1) % this.players.length;
    this.turnTime = TURN_TIME;
    // Switch camera to target current player.
    const player = this.players[this.playerTurnIndex];
    this.enumState = GameStateEnum.PLAYER_MOVE;

    (this.entities.find((entity) => {
      return entity.name === 'cameraControls';
    }) as CameraControls).components.cameraController.player = `@entity-${player.name}`
  }


}