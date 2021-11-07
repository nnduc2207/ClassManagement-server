import express from "express"
import {
    addClass,
    createUser,
    deleteClass,
    deleteUser,
    getMyClasses,
    login,
    updateUser,
    authenticateToken,
    joinClass,
} from "./controller"
import User from "./model"

const router = express.Router()

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const {user, token} = await login({ email, password })
        
        return res.json({user, token})
    } catch (error) {
        return res.status(404).json({ error: error.toString() })
    }
})

router.post("/authenticate", async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        
        if (!token) {
            throw "Failed authentication"
        }
        
        const user = await authenticateToken(token)

        return res.json({user})
    } catch (error) {
        return res.status(404).json({ error: error.toString() })
    }
})

// UPDATE CLASS
router.post("/addclass", async (req, res) => {
    const { studentId, teacherId, classId } = req.body
    
    try {
        await addClass({ studentId, teacherId, classId })

        return res.send(true)
    } catch (error) {
        return res.status(404).json({error: error.toString()})
    }
})

router.delete("/deleteclass", async (req, res) => {
    const { studentId, teacherId, classId } = req.body

    try {
        await deleteClass({ studentId, teacherId, classId })

        return res.send(true)
    } catch (error) {
        return res.status(404).json({ error: error.toString() })
    }
})

// USER DATA
router.get("/students", async (req, res) => {
    try {
        const students = await User.find({ isStudent: true })

        return res.json(students)
    } catch (error) {
        return res.status(404).json({ error: error.toString() })
    }
})

router.get("/teachers", async (req, res) => {
    try {
        const teachers = await User.find({ isStudent: false })

        return res.json(teachers)
    } catch (error) {
        return res.status(404).json({ error: error.toString() })
    }
})

router.post("/", async (req, res) => {
    const { id, name, email, password, isStudent } = req.body
    try {
        const result = await createUser({ id, name, email, password, isStudent })

        return res.json(result)
    } catch (error) {
        return res.status(404).json({ error: error.toString() })
    }
})

router.post("/joinclass/:token", async (req, res) => {
    const { token } = req.params
    const { userId } = req.body
    try {
        const result = await joinClass({ userId, invitedToken: token })

        return res.json(result)
    } catch (error) {
        return res.status(404).json({ error: error.toString() })
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params
    
    try {
        const user = await User.findById(id)

        return res.json(user)
    } catch (error) {
        return res.status(404).json({ error: error.toString() })
    }
})

router.patch("/:id", async (req, res) => {
    const { id } = req.params
    const { name, email } = req.body

    try {
        const user = await updateUser({ id, name, email })

        return res.json(user)
    } catch (error) {
        return res.status(404).send()
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {
        await deleteUser(id)

        return res.send(true)
    } catch (error) {
        return res.status(404).json({error: error.toString()})
    }
})

router.get("/:id/getclasses", async (req, res) => {
    const { id } = req.params
    
    try {
        const classes = await getMyClasses(id)

        return res.json(classes)
    } catch (error) {
        return res.status(404).json({ error: error.toString() })
    }
})

export default router
