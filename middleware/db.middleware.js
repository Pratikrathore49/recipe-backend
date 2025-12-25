const Connect = require("../config/db");

async function checkDB(req, res, next) {
    let conn = await Connect()
    if (conn.status) return next();
    if (!conn.status) return res.json({ message: "Database connection failed ! try after some time or contact your IT person" })
}

module.exports = checkDB;