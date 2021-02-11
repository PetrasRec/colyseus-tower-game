import mongoose from "mongoose";
import { PlayerStats } from "./PlayerStats";

export interface ILobby extends mongoose.Document {
    room_id: string
    winner_user_id: string,
}
const LobbySchema = new mongoose.Schema({
    room_id: {
        type: String,
        required: false,
    },
    winner_user_id : {
        type : String,
        required: true
    },
});

const Lobby = mongoose.model<ILobby>('lobbies', LobbySchema);

export {Lobby}