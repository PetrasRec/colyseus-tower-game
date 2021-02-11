import * as express from 'express';
import { generateAccessToken } from '../auth';
import { Player } from '../game/Player';
import { Lobby } from '../models/Lobby';
import { PlayerStats } from '../models/PlayerStats';
import { User } from '../models/User';

const router = express.Router();

router.get('/:roomId', async (req: express.Request, res: express.Response) => {
    const roomId = req.params.roomId;
    console.log(roomId);
    const lobby = await Lobby.findOne({ room_id: roomId});
    const playerStats = await PlayerStats.find({ room_id: roomId});

    const newPlayersStatsObject = []
    for (let player of playerStats) {
        const user = await User.findOne({ _id: player.user_id});
        newPlayersStatsObject.push({stats: player, user: user});
    }
    res.json({
        lobby_data: lobby,
        playerStats: newPlayersStatsObject,
    });
});


export default router;