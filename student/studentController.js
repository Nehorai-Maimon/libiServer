const studentModel = require("./studentModel")

const create = async (studentData) =>{
    const student = await studentModel.create(studentData)
    return student
}
const read = async (filter,prog)=>{
    const students = await studentModel.find(filter,prog)
    return students
}
const update = async (filter, data)=>{
    const student = await studentModel.updateOne(filter,data)
    return student
}

module.exports = {create, read, update}