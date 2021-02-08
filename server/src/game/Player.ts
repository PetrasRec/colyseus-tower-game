import Entity from "./entity";
import { Schema, type } from "@colyseus/schema";
import Position from "./position";
import { AuthUser } from "../rooms/AuthUser";
import { PITCH_RANGE } from "./constants";

class CanonController extends Schema {
    @type("number")
    yaw: number;
    @type("number")
    pitch: number;

    constructor(yaw: number, pitch: number) {
        super();
        // around
        this.yaw = yaw;
        // up and down
        this.pitch = pitch;
    }

    adjust() {
        this.yaw %= (2 * Math.PI);
        if (this.yaw < 0) {
            this.yaw += (2 * Math.PI);
        }
        this.pitch = this.pitch > PITCH_RANGE[1] ? PITCH_RANGE[1] : this.pitch;
        this.pitch = this.pitch < PITCH_RANGE[0] ? PITCH_RANGE[0] : this.pitch;
        
    }
}

class PlayerComponents extends Schema {
    @type(CanonController)
    cannonController: CanonController

    constructor() {
        super();
        this.cannonController = new CanonController((180*Math.PI) / 180, (-5*Math.PI) / 180);
    }
} 

enum PlayerMove {
    LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3,
    SHOOT = 4
}

class Player extends Entity {
    @type(PlayerComponents)
    components: PlayerComponents

    @type(AuthUser)
    authUser: AuthUser;

    @type("number")
    health: number;

    @type("boolean")
    isAlive: boolean;

    constructor(position: Position, id: number) {
        super("@ref-scene", "@model-cannon", "player", position);
        this.components = new PlayerComponents();
        this.updateRootNameID(id);
    }

    assignAuthUser(authUser: AuthUser) {
        this.authUser = authUser; 
    }

    update(): boolean {
        return true;
    }

    onMove(move: PlayerMove) {
        switch (move) {
            case PlayerMove.UP:
            console.log("Pressed up");
            this.components.cannonController.pitch+= 0.1;
            break;
            case PlayerMove.DOWN: 
            console.log("Pressed down");
            this.components.cannonController.pitch-=0.1;
            break;
            case PlayerMove.LEFT: 
            console.log("Pressed left");
            this.components.cannonController.yaw+=0.1;
            break;
            case PlayerMove.RIGHT: 
            console.log("Pressed right");
            this.components.cannonController.yaw-=0.1;
            break;
        }
        this.components.cannonController.adjust();
    }

    getRootName(): string {
        return "player";
    }
}

export {
    Player,
    PlayerMove,
}