const expressJwt = require('express-jwt');

function authJwt() {
    const tokenSecret = process.env.ACCESS_TOKEN_SECRET
    return expressJwt({
        secret: tokenSecret, 
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path:[
            {url: /\/api\/uploads(.*)/, methods:['GET', 'OPTIONS'] },
            {url: /\/api\/products(.*)/, methods:['GET', 'OPTIONS'] },
            {url: /\/api\/category(.*)/, methods:['GET', 'OPTIONS']},
            '/api/user/loginUser',
            '/api/user/registerUser',
        ]
    })
}

async function isRevoked(req, payload, done){
    if(!payload.isAdmin) {
        done(null, true)
    }
    else{
        done();
    }
}

module.exports = authJwt;