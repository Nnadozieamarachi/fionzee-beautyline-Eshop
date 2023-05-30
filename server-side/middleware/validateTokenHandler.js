const jwt  = require("jsonwebtoken");

const validateToken = async(req, res, next) => {
    try {
        let token;
    let authHeader = req.headers.Authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split("")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                res.status(401);
                throw new Error("user is not authorized");
            }
            req.user = decoded.user;
            next();
        })
        if(!token){
            res.status(401);
            throw new Error("user is not authorized or token is missing");
        }
    }
    } catch (error) {
        res.status(500).json({message: "internal server error!"});
    }
}
module.exports = validateToken;