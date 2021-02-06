import Entity from "./entity";
import { Schema, type } from "@colyseus/schema";


export default class AmbientLight extends Entity {
    constructor() {
        super("@ref-scene", "@light-ambient-0.2", "ambientLight");
    }
    update() {
        
    }
    
    getRootName(): string {
        return "ambientLight";
    }
}