require("dotenv").config()
const express = require("express"),
    app = express(),
    PORT = process.env.PORT,
    cors = require("cors"),
    studentRoute = require("./student/studentRoute"),
    workerRoute = require("./worker/workerRoute"),
    eventRoute = require("./event/eventRoute");

app.use(cors())
app.use(express.json())
app.use((req,res,next)=>{

    console.log(req.ip);
    next();
})
app.use("/student", studentRoute)
app.use("/event", eventRoute)
app.use("/worker", workerRoute)

app.get("/", (req, res) => res.send("hay!!!"))

app.listen(PORT, () => console.log(`server listening on ${PORT}`))
require("./db").connect()