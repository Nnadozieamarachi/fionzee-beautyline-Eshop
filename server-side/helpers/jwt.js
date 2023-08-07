const {expressjwt:jwt}= require('express-jwt');

async function isRevoked(req, payload ){
    if(!payload.isAdmin) {
        return true
    }
    else{
        return false;
    }
}


function authJwt() {
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
    return jwt({
        secret: tokenSecret, 
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path:[
             /\/api\/uploads(.*)/,
            /\/api\/products(.*)/,
            /\/api\/category(.*)/,
            '/api/user/loginUser',
            '/api/user/registerUser',
        ]
    })
}

module.exports = authJwt;