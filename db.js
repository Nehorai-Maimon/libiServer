require("dotenv").config()
const mongoose = require("mongoose"),
    MONGO_URL = process.env.MONGO_URL
mongoose.set("strictQuery", false)

exports.connect = async () => {
    try {
        await mongoose.connect(MONGO_URL, { useNewUrlParser: true },
            err => {
                if (err) { throw err }
                console.log("connection succes, state:", mongoose.connection.readyState);
            })
    } catch (error) {
        console.log("error mongoose:", error); 
    }
}