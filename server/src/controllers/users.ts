import User from "../models/User"
import bcrypt from "bcrypt"
import { Request, Response } from "express"
import jwt, { Secret } from "jsonwebtoken"

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as Secret

export const getUsers = async (_req: Request, res: Response) => {
    const users = await User.find({}).select("-password").lean()
    if (!users?.length) {
        res.status(400).json({ message: "No users found!" })
        return
    }
    res.json(users)
}

export const createUser = async (req: Request, res: Response) => {
    const { username, password } = req.body
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        res.status(409).json({ message: "User already exists!" })
    }
    const hashedPwd = await bcrypt.hash(password, 10)

    const userData = { username, password: hashedPwd }
    const user = await User.create(userData)

    if (user) {
        const accessToken = jwt.sign(
            { userId: user._id, username: user.username },
            accessTokenSecret
        )

        res.cookie("jwt", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: `Invalid user data received!` })
    }
    return
}
