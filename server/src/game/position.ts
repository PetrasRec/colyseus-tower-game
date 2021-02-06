import { Schema, type } from "@colyseus/schema";

export default class Position extends Schema {
    @type("float64")
    x: number; // number is a float :o
    @type("float64")
    y: number;
    @type("float64")
    z: number;

    constructor(x: number, y: number, z:number) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }
}