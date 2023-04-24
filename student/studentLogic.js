const studentController = require("./studentController"),
    studentModel = require("./studentModel"),
    s3 = require('../s3');

const getAllStudents = async () => {
    const students = await studentController.read()
    return students
}

const createStudent = async (studentData) => {
    // check nothing is missing
    if (!studentData.arrServices || !studentData.status || !studentData.service)
        throw { status: 400, message: "missing details" }

    if (!studentData.address.city || !studentData.address.address)
        throw { status: 400, message: "missing details in" }

    if (!studentData.days.year || !studentData.days.days)
        throw { status: 400, message: "missing details in days" }

    studentData.contact.forEach(contact => {
        if (!contact.contactFirstName || !contact.contactLastName || !contact.contactPhone ||
            !contact.contactEmail || contact.apotropus === null || "undefined" || !contact.relative)
            throw { status: 400, message: "missing details in contact" }
    })
    studentData.medication.forEach(medication => {
        if (!medication.name || !medication.time)
            throw { status: 400, message: "missing details in medication" }
    })

    if (!studentData.firstName || !studentData.lastName || !studentData.id || !studentData.gender ||
        !studentData.DateOfBirth || !studentData.hmo || !studentData.diagnosis)
        throw { status: 400, message: "missing details in" }

    const student = await studentController.create(studentData)
    return student
}

const updateStudent = async (studentData) => {
    const student = await studentController.update({ _id: studentData._id }, studentData)
    return student
}
const studentWithExpiration = async () => {
    const currDate = new Date()
    currDate.setDate(currDate.getDate() + 30);
    return await studentController.read({
        status: true, $or: [
            { "general.files.expirationDate": { $lt: currDate } },
            { "housing.files.expirationDate": { $lt: currDate } },
            { "employment.files.expirationDate": { $lt: currDate } },
            { "club.files.expirationDate": { $lt: currDate } }
        ]
    })
}

const updateArrService = async (newArrService, id) => {
    const arrServise = await studentController.update({ _id: id }, { $set: { arrServices: newArrService } })
    return arrServise
}

const addYearDaycare = async (id, year) => {
    // # bring the student
    const student = await studentModel.findOne({ _id: id })
    // # check if there are years inside
    if (student.daycare.general.year.length) {
        // # if true, check if the current year exists
        for (let i in student.daycare.general.year) {
            if (student.daycare.general.year[i].year === year) {
                // # if true, stop and send error
                throw { msg: "student already have this year" };
            }
        }
    }
    // # make object of newYear 
    const newYear = { year }
    // # push to the student 
    await studentModel.updateOne({ _id: id }, { $push: { "daycare.general.year": newYear } })
    // # return the student 
    return await studentModel.findOne({ _id: id })
}

const addTeamDaycare = async (id, year, team) => {
    await studentModel.updateOne({ _id: id, "daycare.general.year.year": year }, { $set: { "daycare.general.year.$.team": team } })
    return await studentModel.findOne({ _id: id })
}

const deleteFile = async (fileKey, id, currentYear) => {
    // # delete from AWS 
    await s3.deleteFile(fileKey)
    // # delete from MongoDB 
    // # if changes on daycare
    if (fileKey.split("/")[1] === "daycare") {
        if (fileKey.split("/")[2] === "general") {
            await studentModel.updateOne({ _id: id },
                {
                    $pull: {
                        [fileKey.split("/")[3] === "files" ?
                            "daycare.general.files"
                            :
                            "daycare.general.filesOp"]: { filePath: fileKey }
                    }
                })
        }
        if (fileKey.split("/")[2] === "speech") {
            await studentModel.updateOne({ _id: id, "daycare.general.year.year": currentYear },
                {
                    $pull: {
                        [fileKey.split("/")[3] === "files" ?
                            "daycare.general.year.$.speech.files"
                            :
                            "daycare.general.year.$.speech.filesOp"]: { filePath: fileKey }
                    }
                })
        }
        if (fileKey.split("/")[2] === "occupation") {
            await studentModel.updateOne({ _id: id, "daycare.general.year.year": currentYear },
                {
                    $pull: {
                        [fileKey.split("/")[3] === "files" ?
                            "daycare.general.year.$.occupation.files"
                            :
                            "daycare.general.year.$.occupation.filesOp"]: { filePath: fileKey }
                    }
                })
        }
        if (fileKey.split("/")[2] === "physiotherapy") {
            await studentModel.updateOne({ _id: id, "daycare.general.year.year": currentYear },
                {
                    $pull: {
                        [fileKey.split("/")[3] === "files" ?
                            "daycare.general.year.$.physiotherapy.files"
                            :
                            "daycare.general.year.$.physiotherapy.filesOp"]: { filePath: fileKey }
                    }
                })
        }
        if (fileKey.split("/")[2] === "social") {
            await studentModel.updateOne({ _id: id, "daycare.general.year.year": currentYear },
                {
                    $pull: {
                        [fileKey.split("/")[3] === "files" ?
                            "daycare.general.year.$.social.files"
                            :
                            "daycare.general.year.$.social.filesOp"]: { filePath: fileKey }
                    }
                })
        }
        if (fileKey.split("/")[2] === "dietician") {
            await studentModel.updateOne({ _id: id, "daycare.general.year.year": currentYear },
                {
                    $pull: {
                        [fileKey.split("/")[3] === "files" ?
                            "daycare.general.year.$.dietician.files"
                            :
                            "daycare.general.year.$.dietician.filesOp"]: { filePath: fileKey }
                    }
                })
        }
        if (fileKey.split("/")[2] === "teacher") {
            await studentModel.updateOne({ _id: id, "daycare.general.year.year": currentYear },
                {
                    $pull: {
                        [fileKey.split("/")[3] === "files" ?
                            "daycare.general.year.$.teacher.files"
                            :
                            "daycare.general.year.$.teacher.filesOp"]: { filePath: fileKey }
                    }
                })
        }
        if (fileKey.split("/")[2] === "medical") {
            await studentModel.updateOne({ _id: id, "daycare.general.year.year": currentYear },
                {
                    $pull: {
                        [fileKey.split("/")[3] === "files" ?
                            "daycare.general.year.$.medical.files"
                            :
                            "daycare.general.year.$.medical.filesOp"]: { filePath: fileKey }
                    }
                })
        }
    } else {
        if (fileKey.split("/")[1] === "general") {
            await studentModel.updateOne({ _id: id },
                {
                    $pull: {
                        [fileKey.split("/")[2] === "files" ?
                            "general.files"
                            :
                            "general.filesOp"]: { filePath: fileKey }
                    }
                })
        }
        if (fileKey.split("/")[1] === "housing") {
            await studentModel.updateOne({ _id: id },
                {
                    $pull: {
                        [fileKey.split("/")[2] === "files" ?
                            "housing.files"
                            :
                            "housing.filesOp"]: { filePath: fileKey }
                    }
                })
        }
        if (fileKey.split("/")[1] === "club") {
            await studentModel.updateOne({ _id: id },
                {
                    $pull: {
                        [fileKey.split("/")[2] === "files" ?
                            "club.files"
                            :
                            "club.filesOp"]: { filePath: fileKey }
                    }
                })
        }
        if (fileKey.split("/")[1] === "employment") {
            await studentModel.updateOne({ _id: id },
                {
                    $pull: {
                        [fileKey.split("/")[2] === "files" ?
                            "employment.files"
                            :
                            "employment.filesOp"]: { filePath: fileKey }
                    }
                })
        }
    }
}

const updateDaycare = async (id, place, form) => {
    // # cut the year of the req
    const reqYear = form.year
    delete form.year

    // console.log(place);
    // console.log(form);
    // # changes on general
    if (place === "general") {
        // # find the current year and update
        await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.tsa": form.tsa } })
    }
    // # changes on speech
    if (place === "speech") {
        // # changes in weeklySummary
        if (form.tab === "weeklySummary") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $push: { "daycare.general.year.$.speech.weeklySummary": form } })
        }
        if (form.tab === "start") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.speech.start": form } })
        }
        if (form.tab === "middle") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.speech.middle": form } })
        }
        if (form.tab === "end") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.speech.end": form } })
        }
        if (form.tab === "tsa") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.speech.tsa": form } })
        }
    }
    // # changes on occupation
    if (place === "occupation") {
        // # changes in weeklySummary
        if (form.tab === "weeklySummary") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $push: { "daycare.general.year.$.occupation.weeklySummary": form } })
        }
        if (form.tab === "start") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.occupation.start": form } })
        }
        if (form.tab === "middle") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.occupation.middle": form } })
        }
        if (form.tab === "end") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.occupation.end": form } })
        }
        if (form.tab === "tsa") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.occupation.tsa": form } })
        }
    }
    // # changes on physiotherapy
    if (place === "physiotherapy") {
        // # changes in weeklySummary
        if (form.tab === "weeklySummary") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $push: { "daycare.general.year.$.physiotherapy.weeklySummary": form } })
        }
        if (form.tab === "start") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.physiotherapy.start": form } })
        }
        if (form.tab === "middle") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.physiotherapy.middle": form } })
        }
        if (form.tab === "end") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.physiotherapy.end": form } })
        }
        if (form.tab === "tsa") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.physiotherapy.tsa": form } })
        }
    }
    // # changes on social
    if (place === "social") {
        // # changes in weeklySummary
        if (form.tab === "weeklySummary") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $push: { "daycare.general.year.$.social.weeklySummary": form } })
        }
        if (form.tab === "goals") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.social.goals": form } })
        }
        if (form.tab === "tsa") {
            delete form.tab
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.social.tsa": form } })
        }
    }
    if (place === "dietician" || place === "teacher" || place === "medical") {
        delete form.tab
        // # changes on dietician
        if (place === "dietician") {
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.dietician.tsa": form } })
        }
        if (place === "teacher") {
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.teacher.tsa": form } })
        }
        if (place === "medical") {
            // # find the current year and update
            await studentController.update({ _id: id, "daycare.general.year.year": reqYear }, { $set: { "daycare.general.year.$.medical.tsa": form } })
        }
    }
    // # send back the updated Student
    return await studentModel.findOne({ _id: id })
}

module.exports = { createStudent, getAllStudents, updateStudent, addYearDaycare, deleteFile, addTeamDaycare, updateDaycare, updateArrService,studentWithExpiration }