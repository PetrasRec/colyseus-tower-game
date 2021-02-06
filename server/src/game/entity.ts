import { Schema, type, ArraySchema } from "@colyseus/schema";
import Position from "./position";

export default abstract class Entity extends Schema  {
    @type(Position)
    position: Position;
    @type("string")
    parent: string;
    @type("string")
    visual: string;

    @type("string")
    name: string;

    constructor(parent: string, visual: string, name: string) {
        super();
        this.parent = parent;
        this.visual = visual;
        this.name = name;
    }

    abstract update(): void;
    abstract getRootName(): string;
    
    updateRootNameID(newID: number) : void {
        this.name = `${this.name}${newID}`
    }
}