import { Room, Client, ServerError } from "colyseus";
import { GameRoomState } from "./schema/GameRoomState";
import { Player } from "./Player";
import {verifyJwtToken} from "../auth"
export class GameRoom extends Room {


  constructor() {
    super();
  }

  onCreate (options: any) {
    const userData = verifyJwtToken(options.token);
    console.log("On Create room", options);
    this.setState(new GameRoomState(options?.title, userData.id));
    this.maxClients = 4;
    this.autoDispose = true;

    // Chat system of the room
    this.onMessage("messages", (client, message) => {
      this.broadcast("messages", `(${client?.auth?.username}) ${message}`);
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
      created_by: {
        id: userData.id,
        username: userData.username,
      }
    });
  }
  // If onAuth() returns a truthy value, onJoin() is going to be called with the returned value as the third argument.
  // If onAuth() returns a falsy value, the client is immediatelly rejected, causing the matchmaking function call from the client-side to fail.
  onAuth(client: Client, options: any) {
    if (!options.token) {
      return false;
    }

    const userData = verifyJwtToken(options.token);
    if (this.state.existsPlayer(<string>userData.id)) {
      return false;
    }
    return new Player(<string>userData.id, <string>userData?.username || "invalid username", client.sessionId);;
  }

  onJoin (client: Client, options: any) {
    // client.auth is the object that is returned from onAuth()
    // add new player
    this.state.addNewPlayer(client.auth);
  }

  onLeave (client: Client, consented: boolean) {
    this.state.removePlayer(client.auth);
  }

  onDispose() {
  }
  
}
