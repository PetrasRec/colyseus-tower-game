import Entity from "./entity";
import { Schema, type } from "@colyseus/schema";


export default class Tower extends Entity {
    constructor() {
        super("@ref-scene", "@model-tower", "tower")
    }
    update() {
        
    }
    
    getRootName(): string {
        return "tower";
    }
}