import { Schema, model } from "mongoose"
import { userSchema } from "../lib/validations/user"
import * as z from "zod"

export type User = z.infer<typeof userSchema>

const UserSchema = new Schema<User>({
    username: {
        type: String,
        required: true,
    },
    password: String,
    googleId: String,
})

const User = model("User", UserSchema)

export default User
