import Entity from "./entity";
import { Schema, type } from "@colyseus/schema";
import Position from "./position";
import { AuthUser } from "../rooms/AuthUser";

class CanonController extends Schema {
    @type("number")
    yaw: number;
    @type("number")
    pitch: number;

    constructor(yaw: number, pitch: number) {
        super();
        this.yaw = yaw;
        this.pitch = pitch;
    }
}

class PlayerComponents extends Schema {
    @type(CanonController)
    cannonController: CanonController

    constructor() {
        super();
        this.cannonController = new CanonController(10, 10);
    }
} 


export default class Player extends Entity {
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
    getRootName(): string {
        return "player";
    }
}