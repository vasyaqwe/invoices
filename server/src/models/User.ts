import { Schema, model } from "mongoose"

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: String,
    googleId: String,
})

const User = model("User", UserSchema)

export default User
