const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const workerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    partnerId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'worker'],
        default: 'worker'
    }
})

const workerModel = mongoose.model("worker", workerSchema)
// async function createWorker() {
//     workerModel.insertMany([
//         {
//             email: "levbinisi@gmail.com",
//             phone: "0528118521",
//             partnerId: "31507494",
//             role: "worker"
//         },
//         {
//             email: "shka67@gmail.com",
//             phone: "0523300484",
//             partnerId: "0522608687",
//             role: "worker"
//         },
//         {
//             email: "naamalevbin@gmail.com",
//             phone: "052-8814559",
//             partnerId: "31953318",
//             role: "worker"
//         },
//         {
//             email: "einav.regev.8@gmail.com",
//             phone: "0545210333",
//             partnerId: "17063033",
//             role: "worker"
//         },
//         {
//             email: "finkelym@gmail.com",
//             phone: "0525666415",
//             partnerId: "23078116",
//             role: "worker"
//         },
//         {
//             email: "lev.hodaya1@gmail.com",
//             phone: "0523115399",
//             partnerId: "218193258",
//             role: "worker"
//         },
//         {
//             email: "edensztrigler@gmail.com",
//             phone: "0552230094",
//             partnerId: "315260018",
//             role: "worker"
//         },
//         {
//             email: "chenushg@gmail.com",
//             phone: "0528999168",
//             partnerId: "305265969",
//             role: "worker"
//         },

//         {
//             email: "einatsat@gmail.com",
//             phone: "0556622785",
//             partnerId: "33753229",
//             role: "worker"
//         },
//         {
//             email: "avital_re@walla.com",
//             phone: "0546339350",
//             partnerId: "25759853",
//             role: "worker"
//         },
//         {
//             email: "ayeletkatif@gmail.com",
//             phone: "0547775914",
//             partnerId: "43115567",
//             role: "worker"
//         },
//         {
//             email: "chavaorthal@gmail.com",
//             phone: "0548424740",
//             partnerId: "309933554",
//             role: "worker"
//         },
//         {
//             email: "tamarisaacs@gmail.com",
//             phone: "0545572913",
//             partnerId: "15465974",
//             role: "worker"
//         },
//         {
//             email: "michal.avivi@gmail.com",
//             phone: "0586060854",
//             partnerId: "326988078",
//             role: "worker"
//         },
//         {
//             email: "mirialoni79@gmail.com",
//             phone: "0540528790",
//             partnerId: "36036093",
//             role: "worker"
//         },
//         {
//             email: "rkeesing@gmail.com",
//             phone: "0528790202",
//             partnerId: "25736612",
//             role: "worker"
//         }
//     ])
// }
// createWorker()
module.exports = workerModel