import Entity from "./entity";
import { Schema, type } from "@colyseus/schema";
import Position from "./position";


export default class Projectile extends Entity {

    @type(Position)
    vector: Position;

    @type("number")
    lifeTime: number = 100;

    constructor(position: Position, vector: Position, id: number) {
        super("@ref-scene", null, "projectile", position);
        this.updateRootNameID(id);
        this.vector = vector;
    }
    
    update() {

        this.position.x += this.vector.x;
        this.position.y += this.vector.y;
        this.position.z += this.vector.z;
        this.lifeTime-=1;
        
        if (this.lifeTime <= 0) {
            return false;
        }
        return true;
    }
    
    getRootName(): string {
        return "projectile";
    }
}