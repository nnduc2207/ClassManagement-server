import { Schema, model } from "mongoose"
import Class from "../class/model";
import User from "../user/model";

const TeachSchema = new Schema(
    {
        teacherId: {
            type: String,
            required: true,
            uppercase: true,
            validate: {
                validator: async function (v) {
                    const user = await User.findById(v)
                    const check = user && !user.isStudent
                    return check
                },
                message: (props) =>
                    `${props.value} is not a exist teacherId!`,
            },
        },
        classId: {
            type: String,
            required: true,
            uppercase: true,
            validate: {
                validator: async function (v) {
                    const _class = await Class.findById(v)
                    return !!_class
                },
                message: (props) =>
                    `${props.value} is not a exist classId!`,
            },
        },
    },
    {
        timestamps: true,
    }
)

const Teach = model("Teach", TeachSchema)

export default Teach
