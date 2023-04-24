const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const eventSchema = new mongoose.Schema({
    days: {
        type: String,
        required: true
    },
    fromDate: {
        type: String,
        required: true
    },
    untilDate: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["פתוח", "סגור"],
        required: true
    },
    studentsInvited: [{
        type: String,
    }],
    studentsPart: [{
        type: String,
    }],
    studentsPaid: [{
        type: String,
    }]
})

const eventModel = mongoose.model("event", eventSchema)

module.exports = eventModel