import { Schema, type } from "@colyseus/schema";

export default class Position extends Schema {
    @type("float64")
    public x: number; // number is a float :o
    @type("float64")
    public y: number;
    @type("float64")
    public z: number;

    constructor(x: number, y: number, z:number) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }
}