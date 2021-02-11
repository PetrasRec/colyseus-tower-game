import Entity from "./entity";
import { Schema, type } from "@colyseus/schema";
import Position from "./position";


export default class Tower extends Entity {
    
    constructor(position: Position, id: number) {
        super("@ref-scene", "@model-tower", "tower", position)
        this.updateRootNameID(id);
    }

    update() : boolean  {
        return true;
    }
    
    getRootName(): string {
        return "tower";
    }
}