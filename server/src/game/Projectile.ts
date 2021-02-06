import Entity from "./entity";
import { Schema, type } from "@colyseus/schema";
import Position from "./position";

class ProjectileController extends Schema {
    @type(Position)
    vector: Position;

    constructor() {
        super();
        this.vector = new Position(0,0,0);
    }
}

class ProjectileComponents extends Schema {
    @type(ProjectileController)
    canonController: ProjectileController

    constructor() {
        super();
        this.canonController = new ProjectileController();
    }
} 


export default class Projectile extends Entity {
    @type(ProjectileComponents)
    components: ProjectileComponents

    constructor() {
        super("@ref-scene", "@model-cannon", "projectile");
        this.components = new ProjectileComponents();
    }
    update() {
        
    }
    
    getRootName(): string {
        return "projectile";
    }
}