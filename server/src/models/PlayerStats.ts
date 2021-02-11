import mongoose from "mongoose";
import { User } from "./User";

export interface IPlayerStats extends mongoose.Document {
    id: string
    user_id: string,
    room_id: string,
    total_damage: number,
    total_kills: number,
    health_left: number
}
const PlayerStatsSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
    },
    user_id: {
       type: String,
       required: true,
    },
    room_id: {
        type: String,
        required: true,
    },
    total_damage : {
        type : Number,
        required: true,
    },
    total_kills : {
        type: Number,
        required: true,
    },
    health_left : {
        type : Number,
        required: true,
    },
});


const PlayerStats = mongoose.model<IPlayerStats>('player_stats', PlayerStatsSchema);

export {PlayerStats}