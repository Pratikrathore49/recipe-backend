require("dotenv").config()
const jwt = require('jsonwebtoken');
const secret = process.env.TOKEN_SECRET

class JsonWebToken {

    generateToken(user) {
        let token = jwt.sign(user, secret, { expiresIn: "1h" })
        return token;
    }

    verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, function (err, user) {
                if (err) {
                    return reject("invalid or Expire Token !")
                }  
                resolve(user)
            })
        })

    }

}

module.exports = new JsonWebToken()