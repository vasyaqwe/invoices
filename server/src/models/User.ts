import { Schema, model } from "mongoose"
import { User } from "../../../common/types"

const UserSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

const User = model<User>("User", UserSchema)

export default User
