import Entity from "./entity";
import { Schema, type, ArraySchema } from "@colyseus/schema";
import Position from "./position";

class CameraControllerManager extends Schema {
    @type([ "string"])
    ctor = new ArraySchema<string>();

    constructor() {
        super();
        // For now this is HARDCODED ?
        this.ctor.push("@entity-player1");
        this.ctor.push("@ref-domElement");
    }
}

class CameraControlsComponents extends Schema {
    @type(CameraControllerManager)
    canonController: CameraControllerManager

    constructor() {
        super();
        this.canonController = new CameraControllerManager();
    }
} 


export default class CameraControls extends Entity {
    @type(CameraControlsComponents)
    components: CameraControlsComponents

    constructor(position: Position) {
        super("@ref-scene", null, "cameraControls", position)
        this.components = new CameraControlsComponents();
    }
    update() {
        
    }
    
    getRootName(): string {
        return "cameraControls";
    }
}