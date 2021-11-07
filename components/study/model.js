import { Schema, model } from "mongoose"
import Class from "../class/model"
import User from "../user/model"

const StudySchema = new Schema(
    {
        studentId: {
            type: String,
            required: true,
            uppercase: true,
            validate: {
                validator: async function (v) {
                    const user = await User.findById(v)
                    const check = user && user.isStudent
                    return check
                },
                message: (props) =>
                    `${props.value} is not a exist studentId!`,
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
        Score: [
            {
                name: {
                    type: String,
                    required: true,
                },
                factor: {
                    type: Number,
                    required: true,
                },
                value: {
                    type: Number,
                    required: true,
                }
            }
        ]
    },
    {
        timestamps: true,
    }
)

const Study = model("Study", StudySchema)

export default Study
