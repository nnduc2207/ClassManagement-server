import Study from "./model";

export async function getStudy({ studentId, classId }) {
    try {
        const study = await Study.findOne({ studentId, classId })

        return study
    } catch (error) {
        throw error
    }
}

export async function getStudiesByUser(studentId) {
    try {
        const studies = await Study.find({ studentId })

        return studies
    } catch (error) {
        throw error
    }
}

export async function getStudiesByClass(classId) {
    try {
        const studies = await Study.find({ classId })

        return studies
    } catch (error) {
        throw error
    }
}

export async function createStudy({ studentId, classId }) {
    try {
        const study = await Study.create({ studentId, classId })

        return study
    } catch (error) {
        throw error
    }
}

export async function deleteStudy({ studentId, classId }) {
    try {
        await Study.findOneAndRemove({ studentId, classId })
        return true
    } catch (error) {
        throw error
    }
}