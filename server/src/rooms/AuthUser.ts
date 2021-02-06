import { Schema, type, MapSchema } from "@colyseus/schema";

export class AuthUser extends Schema {
    @type("string")
    socketId: string;
    @type("string")
    id: string;

    @type("string")
    username: string;

    constructor(id: string, username: string, socketId: string) {
        super();
        this.id = id;
        this.username = username;
        this.socketId = socketId;
    }

}