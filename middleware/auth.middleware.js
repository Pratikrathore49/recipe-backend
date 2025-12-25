const { verifyToken } = require("../config/jwtToken");
const userModel = require("../model/user.model");

async function userMiddleware(req, res, next) {
    try {
        let token = req.cookies.login_token
        
        let header = req && req.headers
        header = header.authorization && header.authorization.split(" ")[1]

        if (header) {
            token = header
        }

        if (!token) {
           return res.json({ status: false, message: "Token Required This Is protected Api" })
        }

        let decodeToken = await verifyToken(token)
        req.user = decodeToken
        let user = await userModel.findOne({ _id: decodeToken.id, isDelete: false });
        if (!user) {
            return res.json({ status: false, message: "user Not Found" })
        }
        next()
    } catch (error) {
        res.json({ status: false, message: error })
    }
}

module.exports = { userMiddleware }