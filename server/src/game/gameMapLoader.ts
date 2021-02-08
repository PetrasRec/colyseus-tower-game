import { Schema, type, ArraySchema, MapSchema } from "@colyseus/schema";
import CameraControls from "./CameraControls";
import Entity from "./entity";
import { Player } from "./Player";
import Position from "./position";
import Terrain from "./Terrain";
import Tower from "./Tower";
import AmbientLight from "./AmbientLight";
import DirectionalLight from "./DirectionalLight";

class MapData {
    entities: ArraySchema<Entity>;
    players: ArraySchema<Player>;
    camera: CameraControls;
}

const loadBadwater = () : MapData => {
    // Set up 4 towers
    const towers = [
        new Tower(new Position(25, 15, 25), 1),
        new Tower(new Position(-25, 15, -25), 2),
        new Tower(new Position(-25, 15, 25), 3),
        new Tower(new Position(25, 15, -25), 4),
    ];

    const camera = new CameraControls(new Position(0, 0 ,0));

    const ambientLight = new AmbientLight();
    ambientLight.position = new Position(0,5,10);

    const directionalLight = new DirectionalLight();
    directionalLight.position = new Position(0,5,10)

    const players = towers.map((t, index) => {
        return new Player(new Position(t.position.x, t.position.y + 12.3, t.position.z), index + 1)
    });
    const terrain = new Terrain();

    const allEntities : Entity[] = []
        .concat(towers.map(t => <Entity>t))
        .concat(players.map(p => <Entity>p))
        .concat([ <Entity>terrain ])
        .concat([ <Entity>camera ])
        .concat([ <Entity>ambientLight])
        .concat([ <Entity>directionalLight ]);

    return {
        // this does NOT copy, but is passed as a reference, and from this
        // I can extract array of players and change them by also changing the array of entities
        entities: new ArraySchema<Entity>(...allEntities),
        players: new ArraySchema<Player>(...players),
        camera: camera,
    };
};

const MapLoader = (mapName: string): MapData => {
    switch (mapName) {
        case "Badwater":
            return loadBadwater();
        default:
            return null;
    }
};

export default MapLoader