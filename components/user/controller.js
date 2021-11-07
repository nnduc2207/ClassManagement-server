import * as bcrypt from "bcrypt"
import { default as jwt } from "jsonwebtoken"

import User from "./model"
import { createStudy, deleteStudy, getStudiesByUser } from "../study/controller"
import { createTeach, deleteTeach, getTeachesByUser } from "../teach/controller"
import Class from "../class/model"

export async function getUsers(isStudent = true) {
    try {
        const user = await User.find({ isStudent })
        return user
    } catch (error) {
        throw error
    }
}

export async function getUser(id) {
    try {
        const user = await User.findById(id)
        return user
    } catch (error) {
        throw error
    }
}

export async function createUser({ id, name, email, password, isStudent }) {
    try {
        if (!(id && name && email && password && isStudent != undefined)) {
            throw "Missing data"
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const user = await User.create({
            id,
            name,
            email,
            password: hash,
            isStudent,
        })

        return user
    } catch (error) {
        if (error.keyPattern?.email) {
            throw "Email has been used"
        }
        if (error.keyPattern?.id) {
            throw "ID has been used"
        }
        throw error
    }
}

export async function updateUser({ id, name, email }) {
    try {
        const user = await User.findById(id)
        if (!user) {
            throw new Error(id + " is not an exist UserId")
        }

        const updatedData = { name, email }
        const attributes = ["name", "email"]

        attributes.forEach((a) => {
            if (updatedData[a]) {
                user[a] = updatedData[a]
            }
        })

        user.save()
        return user
    } catch (error) {
        throw error
    }
}

export async function deleteUser(id) {
    try {
        const user = await User.findById(id)

        if (!user) {
            throw `${id} is not an exist UserId`
        }

        if (user.isStudent) {
            const studies = await getStudiesByUser(id)
            const deleteStudiesProcess = studies.forEach(async (study) => {
                return await study.remove()
            })
            deleteStudiesProcess && (await Promise.all(deleteStudiesProcess))
        } else {
            const teaches = await getTeachesByUser(id)
            const deleteTeachesProcess = teaches.forEach(async (teach) => {
                return await teach.remove()
            })
            deleteTeachesProcess && (await Promise.all(deleteTeachesProcess))
        }

        await user.remove()
    } catch (error) {
        throw error
    }
}

export async function getMyClasses(id) {
    try {
        const user = await User.findById(id)

        if (user.isStudent) {
            const studies = await getStudiesByUser(id)
            return studies
        } else {
            const teaches = await getTeachesByUser(id)
            return teaches
        }
    } catch (error) {
        throw error
    }
}

export async function addClass({
    studentId = undefined,
    teacherId = undefined,
    classId,
}) {
    try {
        if (studentId) {
            await createStudy({ studentId, classId })
        } else {
            await createTeach({ teacherId, classId })
        }
        return true
    } catch (error) {
        throw error
    }
}

export async function joinClass({ userId, invitedToken }) {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw "UserId not exist"
        }

        const _class = await Class.findOne({ invitedToken })
        if (!_class) {
            throw "Invite code not exist"
        }

        if (user.isStudent) {
            await createStudy({ studentId: user.id, classId: _class.id })
        } else {
            await createTeach({ teacherId: user.id, classId: _class.id })
        }

        return true
    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function deleteClass({
    studentId = undefined,
    teacherId = undefined,
    classId,
}) {
    try {
        if (studentId) {
            await deleteStudy({ studentId, classId })
        } else {
            await deleteTeach({ teacherId, classId })
        }
        return true
    } catch (error) {
        throw error
    }
}

export async function login({ email, password }) {
    try {
        const user = await User.findOne({ email })
        if (!user) {
            throw "Account hasn't been created"
        }

        const checkPass = bcrypt.compareSync(password, user.password)
        if (!checkPass) {
            throw "Password wrong"
        }

        const token = jwt.sign(
            { ...user._doc },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        )

        return { user, token }
    } catch (error) {
        throw error
    }
}

export async function authenticateToken(token) {
    try {
        let user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        user = await User.findOne({ id: user.id, password: user.password })
        if (!user) {
            throw "Failed Authentication"
        }

        return user
    } catch (error) {
        throw error
    }
}
