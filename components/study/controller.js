const Study = require("./model")

async function getStudy({ studentId, classId }) {
    try {
        const study = await Study.findOne({ studentId, classId })

        return study
    } catch (error) {
        throw error
    }
}

async function getStudiesByUser(studentId) {
    try {
        const studies = await Study.find({ studentId })

        return studies
    } catch (error) {
        throw error
    }
}

async function getStudiesByClass(classId) {
    try {
        const studies = await Study.find({ classId })

        return studies
    } catch (error) {
        throw error
    }
}

async function createStudy({ studentId, classId }) {
    try {
        const existStudy = await Study.findOne({ studentId, classId })
        if (existStudy) {
            throw 'You already in this class!'
        }
        
        const study = await Study.create({ studentId, classId })

        return study
    } catch (error) {
        throw error
    }
}

async function deleteStudy({ studentId, classId }) {
    try {
        await Study.findOneAndRemove({ studentId, classId })
        return true
    } catch (error) {
        throw error
    }
}

module.exports = {
    getStudy,
    getStudiesByClass,
    getStudiesByUser,
    createStudy,
    deleteStudy,
}