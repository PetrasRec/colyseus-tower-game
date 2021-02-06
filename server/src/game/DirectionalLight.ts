import Entity from "./entity";
import { Schema, type } from "@colyseus/schema";

export default class DirectionalLight extends Entity {
    constructor() {
        super("@ref-scene", "@light-directional-0.6", "directionalLight");
    }
    update() {
        
    }
    
    getRootName(): string {
        return "directionalLight";
    }
}