import * as express from 'express';
import { generateAccessToken } from '../auth';
import { Player } from '../rooms/Player';

const loginHandler = (req: express.Request, res: express.Response) => {
    res.json({
        token: generateAccessToken({
            username: req.body.username,
        })
    });
};

export {
    loginHandler,
}