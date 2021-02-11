import Entity from "./entity";
import { Schema, type, ArraySchema } from "@colyseus/schema";
import Position from "./position";

class CameraControllerManager extends Schema {
    @type([ "string"])
    ctor = new ArraySchema<string>();

    @type("string")
    entity: string;

    constructor(player: string) {
        super();
        this.entity = player;
        // For now this is HARDCODED ?
        this.ctor.push("@ref-domElement");
    }
}

class CameraControlsComponents extends Schema {
    @type(CameraControllerManager)
    cameraController: CameraControllerManager

    constructor() {
        super();
        this.cameraController = new CameraControllerManager("@entity-player-1");
    }
} 


export default class CameraControls extends Entity {
    @type(CameraControlsComponents)
    components: CameraControlsComponents

    constructor(position: Position) {
        super("@ref-scene", null, "cameraControls", position)
        this.components = new CameraControlsComponents();
    }
    update() : boolean {
        return true;
    }
    
    getRootName(): string {
        return "cameraControls";
    }
}