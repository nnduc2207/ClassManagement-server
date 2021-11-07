const Class = require("./model")
const { getStudiesByClass } = require("../study/controller")
const { getTeachesByClass } = require("../teach/controller")
const User = require("../user/model")
const crypto = require("crypto")

async function getClasses() {
    try {
        const classes = await Class.find({})
        return classes
    } catch (error) {
        throw error
    }
}

async function getClass(id) {
    try {
        const _class = await Class.findById(id)
        return _class
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function createClass({ id, name }) {
    try {
        const token = crypto.randomUUID()
        const newClass = await Class.create({ id, name, invitedToken: token })

        return newClass
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function deleteClass(id) {
    try {
        const studies = await getStudiesByClass(id)
        if (studies.length != 0) {
            const deleteStudiesProcess = studies.forEach(async (study) => {
                return await study.remove()
            })
            await Promise.all(deleteStudiesProcess)
        }

        const teaches = await getTeachesByClass(id)
        if (teaches.length != 0) {
            const deleteTeachesProcess = teaches.forEach(async (teach) => {
                return await teach.remove()
            })
            await Promise.all(deleteTeachesProcess)
        }

        await Class.findByIdAndRemove(id)
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function getStudents(id) {
    try {
        const studies = await getStudiesByClass(id)
        let students = await studies.map(
            async (study) => await User.findById(study.studentId)
        )
        students = Promise.all(students)
        return students
    } catch (error) {
        throw error
    }
}

async function getTeachers(id) {
    try {
        const teaches = await getTeachesByClass(id)
        let teachers = await teaches.map(
            async (study) => await User.findById(study.teacherId)
        )
        teachers = Promise.all(teachers)
        return teachers
    } catch (error) {
        throw error
    }
}

async function getInvitedToken(id) {
    try {
        const _class = await Class.findById(id)
        return _class.invitedToken
    } catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = {
    getClasses,
    getClass,
    createClass,
    deleteClass,
    getStudents,
    getTeachers,
    getInvitedToken,
}