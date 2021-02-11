import { Room, Client, ServerError, Delayed } from "colyseus";
import { GameRoomState } from "./schema/GameRoomState";
import { AuthUser } from "./AuthUser";
import {verifyJwtToken} from "../auth"
import MapLoader from "../game/gameMapLoader";

export class GameRoom extends Room {
  constructor() {
    super();
  }
  private gameLoop!: Delayed;
  private timerLoop!: Delayed;

  // 1000 is 1 second
  startGameLoop = () =>  {
    // create gameState and set up some vars
    this.state.startGame();
    const loopInterval = 50;
    this.gameLoop = this.clock.setInterval(this.updateState, loopInterval);
    this.timerLoop = this.clock.setInterval(this.onSecondPassed, 1000)
  }

  onSecondPassed = () => {
    this.state.onSecondPassed();
  }

  stopGameLoop = () =>  {
      this.gameLoop.clear();
  }


  // Here write state updates, updated state will be automatically sent to client
  updateState = () => {
    if (this.state.warmupTimeSeconds > 0) {
      return;
    }
    this.state.update();
  }

  // data must have a token
  onPlayerInput = (client: Client, data: any) => {
    this.state.onPlayerInput(client.sessionId, <number[]>data);
  }

  onCreate (options: any) {
    const userData = verifyJwtToken(options.token);
    console.log("On Create room", options);
    this.setState(new GameRoomState(options?.title, userData.id, this.roomId));
    this.maxClients = 4;
    this.autoDispose = true;

    // Chat system of the room
    this.onMessage("messages", (client, message) => {
      const times = new Date().toTimeString().split(":");
      this.broadcast("messages", {
        username: client?.auth?.username,
        message: message,
        time: times[0] + ":" + times[1]
      });
    });

    this.onMessage("start_lobby", (client, message) => {
      console.log("Start lobby!!!", this.state);
      // Lobby already has started or ended
      if (this.state.lobbyState !== 3) {
    
        return;
      }

      // PLAYING State is 1, much wow
      this.state.lobbyState = 1;

      this.broadcast("start_lobby", {});
      this.startGameLoop();
    });

    // Manager player input
    this.onMessage("player_input", this.onPlayerInput);
    // This will be return on prop 'metadata' when quering all rooms
    this.setMetadata({
      title: options.title,
      created_by: {
        id: userData.id,
        username: userData.username,
      }
    });
  }
  getUserFromToken(client: Client, token: string) : AuthUser {
    const userData = verifyJwtToken(token);
    return new AuthUser(<string>userData.id, <string>userData?.username || "invalid username", client.sessionId);;
  }

  // If onAuth() returns a truthy value, onJoin() is going to be called with the returned value as the third argument.
  // If onAuth() returns a falsy value, the client is immediatelly rejected, causing the matchmaking function call from the client-side to fail.
  onAuth(client: Client, options: any) {
    if (!options.token) {
      return false;
    }

    const user = this.getUserFromToken(client, options.token);

    if (this.state.existsPlayer(user.id)) {
      return false;
    }

    return user;
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
