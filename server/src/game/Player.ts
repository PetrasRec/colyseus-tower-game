import Entity from "./entity";
import { Schema, type } from "@colyseus/schema";

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
    canonController: CanonController

    constructor() {
        super();
        this.canonController = new CanonController(10, 10);
    }
} 


export default class Player extends Entity {
    @type(PlayerComponents)
    components: PlayerComponents

    constructor() {
        super("@ref-scene", "@model-cannon", "player");
        this.components = new PlayerComponents();
    }
    update() {
        
    }
    getRootName(): string {
        return "player";
    }
}