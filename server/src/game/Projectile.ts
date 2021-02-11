import Entity from "./entity";
import { Schema, type } from "@colyseus/schema";
import Position from "./position";
import { GRAVITY_POWER } from "./constants";


export default class Projectile extends Entity {

    @type(Position)
    vector: Position;

    @type("number")
    lifeTime: number = 100;

    @type("string")
    ownerName: string;

    constructor(position: Position, vector: Position, ownerName: string, id: number) {
        super("@ref-scene", null, "projectile", position);
        this.updateRootNameID(id);
        this.vector = vector;
        this.ownerName = ownerName;
    }
    
    update() {

        this.position.x += this.vector.x;
        this.position.y += this.vector.y;
        this.position.z += this.vector.z;
        this.vector.y -= GRAVITY_POWER;
        this.lifeTime-=1;
        
        if (this.lifeTime <= 0) {
            console.log("Delete bullet :O");
            return false;
        }
        return true;
    }
    
    getRootName(): string {
        return "projectile";
    }
}