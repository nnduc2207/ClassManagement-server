import Teach from "./model";

export async function getTeach({ teacherId, classId }) {
    try {
        const teach = await Teach.findOne({ teacherId, classId })

        return teach
    } catch (error) {
        throw error
    }
}

export async function getTeachesByUser(teacherId) {
    try {
        const teaches = await Teach.find({ teacherId })

        return teaches
    } catch (error) {
        throw error
    }
}

export async function getTeachesByClass(classId) {
    try {
        const teaches = await Teach.find({ classId })

        return teaches
    } catch (error) {
        throw error
    }
}

export async function createTeach({ teacherId, classId }) {
    try {
        const teach = await Teach.create({ teacherId, classId })

        return teach
    } catch (error) {
        throw error
    }
}

export async function deleteTeach({ teacherId, classId }) {
    try {
        await Teach.findOneAndRemove({ teacherId, classId })
        return true
    } catch (error) {
        throw error
    }
}