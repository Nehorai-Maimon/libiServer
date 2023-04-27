const express = require('express'),
    router = express.Router(),
    studentLogic = require("./studentLogic"),
    multer = require('multer'),
    auth = require('../auth'),
    path = require('path'),
    s3 = require('../s3'),
    fs = require('fs'),
    util = require('util'),
    mongoose = require('mongoose'),
    studentController = require("./studentController"),
    studentModel = require("./studentModel");

const unlinkFile = util.promisify(fs.unlink)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        // console.log("multer", file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

// get all students
router.get("/", auth.verifyToken, async (req, res) => {
    try {
        const students = await studentLogic.getAllStudents()
        res.send(students)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
// get students with files that are about to expire
router.get("/studentWithExpiration", auth.verifyToken, async (req, res) => {
    try {
        const students = await studentLogic.studentWithExpiration()
        res.send(students)
    } catch (error) {
        res.status(400).send(error.message)
    }
})
//  create student
router.post("/", async (req, res) => {
    try {
        const student = await studentLogic.createStudent(req.body)
        res.send({ student })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

//  הורדת קבצים מהענן
router.post("/files", async (req, res) => {
    try {
        const url = await s3.getUrl(req.body.filePath)
        res.send({ server: url })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post("/updateStudent", async (req, res) => {
    try {
        await studentLogic.updateStudent(req.body)
        const student = await studentModel.findOne({ _id: req.body._id })
        res.send({ server: student })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post("/updateArrService", async (req, res) => {
    try {
        await studentLogic.updateArrService(req.body, req.headers.studentid)
        res.send({ server: "arr changed" })
    } catch (error) {
        res.status(400).send(error.message)
    }
})
// פונקציה שמוסיפה שנה חדשה בשרת
router.post("/addYearDaycare", async (req, res) => {
    try {
        const student = await studentLogic.addYearDaycare(req.headers.studentid, req.body.year)
        res.send({ server: student })
    } catch (error) {
        res.status(400).send(error.message)
    }
})
// פונקציה שמכניסה חניך לקבוצה
router.post("/addTeamDaycare", async (req, res) => {
    try {
        const student = await studentLogic.addTeamDaycare(req.headers.studentid, req.body.year, req.body.team)
        res.send({ server: student })
    } catch (error) {
        res.status(400).send(error.message)
    }
})
// שינוי פרטים בטפסי מעון והוספת טפסים
router.post("/updateDaycare", async (req, res) => {
    try {
        // console.log("place", req.headers.place);
        // console.log("id", req.headers.studentid);
        // console.log(req.body);
        const student = await studentLogic.updateDaycare(req.headers.studentid, req.headers.place, req.body)
        res.send({ server: student })
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.post("/dayCare/general/files", async (req, res) => {
    try {
        await studentLogic.updateStudent(req.body)
        res.send({ server: "user changed" })
    } catch (error) {
        res.status(400).send(error.message)
    }
})
router.post("/dayCare/general/year", async (req, res) => {
    try {
        await studentLogic.updateStudent(req.body)
        res.send({ server: "user changed" })
    } catch (error) {
        res.status(400).send(error.message)
    }
})
// מחיקת קבצים מהענן
router.post("/dayCare/deleteFile", async (req, res) => {
    try {
        // # get the data
        const fileKey = req.body.key
        const id = req.body.studentId
        const currentYear = req.body.year
        await studentLogic.deleteFile(fileKey, id, currentYear)

        // # get the updeted user 
        const student = await studentModel.findOne({ _id: id })
        // # send the updeted user to the front 
        res.send({ server: student })

    } catch (error) {
        res.status(400).send({ server: error.message })
    }
})
// העלאת קבצים לענן
router.post("/generalFiles", upload.array("files", 5), async (req, res) => {
    try {
        // # get the path
        const place = req.headers.place
        const dir = req.headers.dir
        const year = req.headers.currentyear
        const studentId = req.headers.studentid

        // console.log(place);
        // console.log(dir);

        // # get the current user
        const cStudent = await studentController.read({ _id: studentId })
        // console.log("student", cStudent);
        // # upload the file to s3 
        const result = await s3.uploadFilesAWS(req.files[0],
            // # check if the file came from daycare 
            req.headers.daycare ?
                `${cStudent[0].firstName} ${cStudent[0].lastName}/daycare/${place}/${dir}/`
                :
                `${cStudent[0].firstName} ${cStudent[0].lastName}/${place}/${dir}/`)
        console.log("result", result);
        // # delete th upload file from the upload folder 
        await unlinkFile(req.files[0].path)

        // # create file referance to the mongo 
        let mongoRef;
        if (req.body.fileDate !== "undefined") {
            mongoRef = {
                filePath: result.Key,
                inputName: req.body.inputName,
                fileName: req.body.fileName,
                expirationDate: new Date(req.body.fileDate)
            }
        } else {
            mongoRef = {
                filePath: result.Key,
                inputName: req.body.inputName,
                fileName: req.body.fileName
            }
        }

        console.log("mongoRef", mongoRef);

        // # update the student in the right place abaut the new file
        if (req.headers.daycare) {
            if (place === "general") {
                dir === "files" ?
                    await studentController.update({ _id: studentId }, { $push: { "daycare.general.files": mongoRef } })
                    :
                    await studentController.update({ _id: studentId }, { $push: { "daycare.general.filesOp": mongoRef } })
            }
            if (place === "speech") {
                dir === "files" ?
                    await studentController.update({ _id: studentId, "daycare.general.year.year": year }, { $push: { "daycare.general.year.$.speech.files": mongoRef } })
                    :
                    await studentController.update({ _id: studentId, "daycare.general.year.year": year }, { $push: { "daycare.general.year.$.speech.filesOp": mongoRef } })
            }
            if (place === "occupation") {
                dir === "files" ?
                    await studentController.update({ _id: studentId, "daycare.general.year.year": year }, { $push: { "daycare.general.year.$.occupation.files": mongoRef } })
                    :
                    await studentController.update({ _id: studentId, "daycare.general.year.year": year }, { $push: { "daycare.general.year.$.occupation.filesOp": mongoRef } })
            }
            if (place === "physiotherapy") {
                dir === "files" ?
                    await studentController.update({ _id: studentId, "daycare.general.year.year": year }, { $push: { "daycare.general.year.$.physiotherapy.files": mongoRef } })
                    :
                    await studentController.update({ _id: studentId, "daycare.general.year.year": year }, { $push: { "daycare.general.year.$.physiotherapy.filesOp": mongoRef } })
            }
            if (place === "social") { }
            if (place === "dietician") {
                await studentController.update({ _id: studentId, "daycare.general.year.year": year }, { $push: { "daycare.general.year.$.dietician.filesOp": mongoRef } })
            }
            if (place === "teacher") {
                await studentController.update({ _id: studentId, "daycare.general.year.year": year }, { $push: { "daycare.general.year.$.teacher.filesOp": mongoRef } })
            }
            if (place === "medical") {
                await studentController.update({ _id: studentId, "daycare.general.year.year": year }, { $push: { "daycare.general.year.$.medical.filesOp": mongoRef } })
            }
        } else {
            if (place === "general") {
                dir === "files" ?
                    await studentController.update({ _id: studentId }, { $push: { "general.files": mongoRef } })
                    :
                    await studentController.update({ _id: studentId }, { $push: { "general.filesOp": mongoRef } })
            }
            if (place === "housing") {
                dir === "files" ?
                    await studentController.update({ _id: studentId }, { $push: { "housing.files": mongoRef } })
                    :
                    await studentController.update({ _id: studentId }, { $push: { "housing.filesOp": mongoRef } })
            }
            if (place === "employment") {
                dir === "files" ?
                    await studentController.update({ _id: studentId }, { $push: { "employment.files": mongoRef } })
                    :
                    await studentController.update({ _id: studentId }, { $push: { "employment.filesOp": mongoRef } })
            }
            if (place === "club") {
                dir === "files" ?
                    await studentController.update({ _id: studentId }, { $push: { "club.files": mongoRef } })
                    :
                    await studentController.update({ _id: studentId }, { $push: { "club.filesOp": mongoRef } })
            }
        }
        // # send the updated student to the front
        const newStudent = await studentModel.findOne({ _id: studentId })
        res.send({ server: newStudent })
    } catch (error) {
        res.status(400).send({ server: error.message })
    }
})

module.exports = router