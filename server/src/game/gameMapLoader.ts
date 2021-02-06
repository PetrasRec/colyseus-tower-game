import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import Entity from "./entity";
import Player from "./Player";


const maps = new Set();
maps.add("badwater");



const MapLoader = (mapName: string): {entities: ArraySchema<Entity>, players: ArraySchema<Player>} => {
    if (!maps.has(mapName)) {

    }
    
    return {
        entities: null,
        players: null,
    }
};

export default MapLoader