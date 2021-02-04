import { Schema, type, ArraySchema } from "@colyseus/schema";
import Player from "./Player";
import Entity from "./entity";
import Tower from "./Tower";
import CameraControls from "./CameraControls";
import AmbientLight from "./AmbientLight";
import Terrain from "./Terrain";
import DirectionalLight from "./DirectionalLight";

export class GameState extends Schema {
  @type([Entity])
  entities = new ArraySchema<Entity>();

  constructor() {
    super();
    this.entities.push(new Player());
    this.entities.push(new Tower());
    this.entities.push(new CameraControls());
    this.entities.push(new AmbientLight());
    this.entities.push(new DirectionalLight());
    this.entities.push(new Terrain());
  }
  
}