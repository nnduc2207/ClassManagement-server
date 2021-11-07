import Class from "./model"
import { getStudiesByClass } from "../study/controller"
import { getTeachesByClass } from "../teach/controller"
import User from "../user/model"
import crypto from "crypto"

export async function getClasses() {
    try {
        const classes = await Class.find({})
        return classes
    } catch (error) {
        throw error
    }
}

export async function getClass(id) {
    try {
        const _class = await Class.findById(id)
        return _class
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function createClass({ id, name }) {
    try {
        const token = crypto.randomUUID()
        const newClass = await Class.create({ id, name, invitedToken: token })

        return newClass
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function deleteClass(id) {
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

export async function getStudents(id) {
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

export async function getTeachers(id) {
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
