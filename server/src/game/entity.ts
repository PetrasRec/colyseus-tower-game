import { Schema, type, ArraySchema } from "@colyseus/schema";
import Position from "./position";

export default abstract class Entity extends Schema  {

    @type(Position)
    public position: Position;
    @type("string")
    public parent: string;
    @type("string")
    public visual: string;

    @type("string")
    public name: string;

    constructor(parent: string, visual: string, name: string, position: Position = new Position(0, 0, 0)) {
        super();
        this.parent = parent;
        this.visual = visual;
        this.name = name;
        this.position = position;
    }

    abstract update(): boolean;
    abstract getRootName(): string;
    
    updateRootNameID(newID: number) : void {
        this.name = `${this.name}-${newID}`
    }
}