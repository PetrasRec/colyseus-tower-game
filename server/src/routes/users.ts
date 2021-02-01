import * as express from 'express';
import { generateAccessToken } from '../auth';
import { User } from '../models/User';

const router = express.Router();

router.post('/login', async (req: express.Request, res: express.Response) => {
    console.log(req.body);
    if (req.body.email) {
        const user = await User.findOne({ email: req.body.email});
        // compare passwords etc
     
    } else {
        // only username should be given
        const newUser = new User({username: req.body.username});
        await newUser.save();
        res.json({
            token: generateAccessToken({
                id: newUser._id,
                username: newUser.username,
            })
        });
    }   
});

router.post('/register', async (req: express.Request, res: express.Response) => {
    const { username, email, password} = req.body;

    if (!email || !password) {
        throw new Error("Invalid props");
        res.sendStatus(400);
    }
    const user = await User.findOne({ email: req.body.email});
    if (user) {
        throw new Error("Email is already in use");
    }

    const newUser = new User({
        username,
        email,
        password
    });
    await newUser.save();
    res.sendStatus(200);
});

export default router;