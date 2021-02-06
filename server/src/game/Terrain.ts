import Entity from "./entity";
import { Schema, type } from "@colyseus/schema";

export default class Terrain extends Entity {

    constructor() {
        super("@ref-scene", "@model-terrain", "terrain");
    }
    update() {
        
    }
    
    getRootName(): string {
        return "terrain";
    }
}