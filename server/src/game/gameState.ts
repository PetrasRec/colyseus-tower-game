import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import { Player, PlayerMove } from "./Player";
import Entity from "./entity";
import CameraControls from "./CameraControls";
import Position from "./position";
import MapLoader from "./gameMapLoader";
import { AuthUser } from "../rooms/AuthUser";
import { MAX_BULLET_START_SPEED, TURN_TIME } from "./constants";
import Projectile from "./Projectile";

enum GameStateEnum {
  PLAYER_MOVE = 0,
  SWITCH_PLAYER = 1,
  BALL_CAM = 2,
  WIN_STATE=3,
}


class GameState extends Schema {
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
  public endScreenTime: number;

  @type("number")
  public enumState: GameStateEnum;
  // This is kinda dumb, but this var represents a state after a players shoots a ball.
  // You have to wait till the ball hits the target or is deleted.
  @type("boolean")
  public waitingForMoveToFinish: boolean = false;

  @type("number")
  private playerMoveIndex: number = -1;

  constructor(usersJoined: MapSchema<AuthUser>) {
    super();
    const loadedMapData = MapLoader("Badwater", usersJoined.size)
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
    if (this.enumState === GameStateEnum.PLAYER_MOVE) {
      this.turnTime--;
    }
    if (this.endScreenTime > 0) {
      this.endScreenTime--;
    }
  }

  onEntityDelete(entity: Entity) {
    if (entity instanceof Projectile) {
      this.enumState = GameStateEnum.SWITCH_PLAYER;
    }
  }

  updateEntity(entity: Entity) {
    let isEntityAlive = entity.update();
    if (!isEntityAlive) {
      this.onEntityDelete(entity);
    }

    // dumb logic, but will work for this project.. xd
    if (entity instanceof Projectile) {
      const projectile = <Projectile>entity;
      if (projectile.position.y < 0) {
        this.onEntityDelete(entity);
        return false;
      }
      for (let player of this.players) {
        if (player.name === projectile.owner.name || !player.isAlive) {
          continue;
        }
        // check collisions
        const radius = 4;
        const posA = player.position;
        const posB = entity.position;
        // Calculate dumb dist ignoring y
        const dist = Math.sqrt(Math.pow(posA.x - posB.x, 2) + Math.pow(posA.z  - posB.z, 2));
        if (radius > dist && posB.y < posA.y && posB.y > 15) {
          player.damage();
          projectile.owner.damageDone++;
          if (!player.isAlive) {
            projectile.owner.totalKills++;
          }
          if(isEntityAlive) {
            this.onEntityDelete(entity);
            isEntityAlive = false;
          }
          return isEntityAlive;
        }
      }
    }
    return isEntityAlive;
  }

  update() {
    this.doPlayerMove();
    // Update game entities
    this.entities = this.entities.filter(this.updateEntity.bind(this));
    // TODO: collisions ? DAMAGE PLAYERS etc.
    const playersLeftAlive = this.players.filter(p=>p.isAlive);
    if (this.enumState === GameStateEnum.WIN_STATE) {
      return;
    }
    if (playersLeftAlive.length === 1) {
      // After the game is over, make current player the focus of the camera.
      this.camera.components.cameraController.entity = `@entity-${this.players[this.playerTurnIndex].name}`;
      this.camera.components.cameraController.maxDistance = 30;
      this.enumState = GameStateEnum.WIN_STATE;
      this.endScreenTime = 5;
      return;
    }
    // Skip current player's turn
    if (this.turnTime <= 0 || this.enumState == GameStateEnum.SWITCH_PLAYER) {
      this.setNextPlayerTurn();
    }
  }

  getWinnerPlayer() {
    return this.players[this.playerTurnIndex];
  }
 

  shoot(player: Player) {
    // where the bulelt should be spawned
    const ballPosition = new Position(player.position.x, player.position.y + 1.4, player.position.z);
    // calculate its trajectory
    const { yaw, pitch } = player.components.cannonController;
    const vx = -Math.cos(yaw) * Math.cos(pitch);
    const vy = Math.sin(-pitch);
    const vz = Math.sin(yaw) * Math.cos(pitch);
    const ballVector = new Position(vx * MAX_BULLET_START_SPEED, vy * MAX_BULLET_START_SPEED, vz * MAX_BULLET_START_SPEED);
    this.entities.push(new Projectile(ballPosition, ballVector, player, 1))
    this.enumState = GameStateEnum.BALL_CAM
    this.camera.components.cameraController.entity = `@entity-projectile-1`;
    this.camera.components.cameraController.maxDistance = 30;

  }

  doPlayerMove() {
    if (this.playerMoveIndex === -1 || this.playerTurnIndex === -1) {
      return;
    }
    let player = this.players[this.playerTurnIndex];
    if (this.playerMoveIndex === PlayerMove.SHOOT) {
      if (this.enumState !== GameStateEnum.PLAYER_MOVE) {
        this.playerMoveIndex = -1;
        return
      }
      // Shoot and after a hit switch Player turn
      this.shoot(player);
      this.playerMoveIndex = -1;
      return
    } 

    player.onMove(this.playerMoveIndex);
    this.playerMoveIndex = -1;
  }

  onPlayerInput(user: AuthUser, inputs: number[]) {
    if (this.playerTurnIndex === -1) {
      return;
    }
    let player = this.players[this.playerTurnIndex];

    if (player.authUser === null || player.authUser === undefined) {
      return;
    }
    if (player.authUser.id !== user.id) {
      return;
    }
    if (inputs.length === 0) {
      return;
    }
    this.playerMoveIndex = inputs[0];
  }

  setNextPlayerTurn() {
    this.playerTurnIndex = (this.playerTurnIndex + 1) % this.players.length;
    this.turnTime = TURN_TIME;
    // Switch camera to target current player.
    const player = this.players[this.playerTurnIndex];
    if (!player.isAlive) {
      this.setNextPlayerTurn();
      return;
    }
    this.enumState = GameStateEnum.PLAYER_MOVE;

    this.camera.components.cameraController.entity = `@entity-${player.name}`
    this.camera.components.cameraController.maxDistance = 80;
  }


}

export {
  GameStateEnum,
  GameState,
}