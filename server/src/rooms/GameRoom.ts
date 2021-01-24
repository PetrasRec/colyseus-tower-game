import { Room, Client, ServerError } from "colyseus";
import { GameRoomState } from "./schema/GameRoomState";
import { Player } from "./Player";

export class GameRoom extends Room {

  private playerMap: Map<string, Player>;

  constructor() {
    super();
    this.playerMap = new Map<string, Player>();

  }

  onCreate (options: GameRoomState) {
    console.log("On Create room", options);
    this.setState(new GameRoomState(options?.title));
    // Chat system of the room
    this.onMessage("messages", (client, message) => {
      this.broadcast("messages", `(${client?.sessionId}) ${message}`);
    });

    this.onMessage("start_lobby", (client) => {
      // Lobby already has started or ended
      if (this.state.gameState !== 3) {
        return;
      }

      // PLAYING State is 1, much wow
      this.state.gameState = 1;
    });

    // This will be return on prop 'metadata' when quering all rooms
    this.setMetadata({
      title: options.title,
    });
  }

  onAuth(client: Client, options: any) {
    console.log(client.sessionId);
    if (this.playerMap.has(client.sessionId)) {
      throw new ServerError(401, "You are already in this lobby");
    }
    return client;
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId);
    this.playerMap.set(client.sessionId, new Player(client.sessionId));
  }

  onLeave (client: Client, consented: boolean) {
    this.playerMap.delete(client.sessionId);
  }

  onDispose() {
  }
  
}
