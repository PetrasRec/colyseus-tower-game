import jwt from "jsonwebtoken"

const authenticateTokenMiddleware = (req: any, res:any, next: any) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token
    jwt.verify(token, "access secret :o" as string, (err: any, user: any) => {
      console.log(user)
      if (err) return res.sendStatus(403)
      req.user = user
      next() // pass the execution off to whatever request the client intended
    })
};

const verifyJwtToken = (token: string): any => jwt.verify(token, "access secret :o" as string);

const generateAccessToken = (playerData: any) => {
    console.log(playerData);
    return jwt.sign(playerData, "access secret :o", {
        algorithm: "HS256",
        expiresIn: 100000000,
    });
};

export {
    authenticateTokenMiddleware,
    generateAccessToken,
    verifyJwtToken,
}