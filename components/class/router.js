import express from "express"
import { createClass, deleteClass, getClass, getClasses, getStudents, getTeachers } from "./controller"

const router = express.Router()

router.get("/", async function (req, res) {
    try {
        const classes = await getClasses()
        return res.json(classes)
    } catch (error) {
        return res.status(404).json(error)
    }
})

router.post("/", async (req, res) => {
    const { id, name } = req.body
    try {
        const result = await createClass({ id, name })

        return res.json(result)
    } catch (error) {
        return res.status(404).json(error)
    }
})

router.get("/:id", async function (req, res) {
    try {
        const { id } = req.params
        const _class = await getClass(id)
        return res.json(_class)
    } catch (error) {
        return res.status(404).json(error)
    }
})

router.delete("/:id", async function (req, res) {
    try {
        const { id } = req.params
        await deleteClass(id)
        return res.send(true)
    } catch (error) {
        return res.status(404).json(error)
    }
})

router.get("/:id/getstudents", async function (req, res) {
    try {
        const { id } = req.params
        const students = await getStudents(id)
        return res.json(students)
    } catch (error) {
        return res.status(404).json(error)
    }
})

router.get("/:id/getteachers", async function (req, res) {
    try {
        const { id } = req.params
        const teachers = await getTeachers(id)
        return res.json(teachers)
    } catch (error) {
        return res.status(404).json(error)
    }
})


export default router
