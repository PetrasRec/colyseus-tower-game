import { Schema, type, ArraySchema } from "@colyseus/schema";
import Position from "./position";

export default class Entity extends Schema  {
    @type(Position)
    position: Position;
    @type("string")
    parent: string;
    @type("string")
    visual: string;

    constructor(parent: string, visual: string) {
        super();
        this.parent = parent;
        this.visual = visual;
    }
}