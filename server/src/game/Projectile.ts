import Entity from "./entity";
import { Schema, type } from "@colyseus/schema";
import Position from "./position";
import { GRAVITY_POWER } from "./constants";
import { Player } from "./Player";


export default class Projectile extends Entity {

    @type(Position)
    vector: Position;

    @type("number")
    lifeTime: number = 100;

    @type(Player)
    owner: Player;

    constructor(position: Position, vector: Position, owner: Player, id: number) {
        super("@ref-scene", null, "projectile", position);
        this.updateRootNameID(id);
        this.vector = vector;
        this.owner = owner;
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