require("dotenv").config()
const mongoose = require('mongoose');

let url = process.env.DB

async function ConnectDB() {
    try {
        await mongoose.connect(url)
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = ConnectDB;