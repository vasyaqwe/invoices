import User from "../models/User"
import bcrypt from "bcrypt"
import { Request, Response } from "express"
import jwt, { Secret } from "jsonwebtoken"
import {
    cookieConfig,
    generateAccessToken,
    generateRefreshToken,
    refreshTokenExpiresIn,
    refreshTokenSecret,
} from "../lib/utils"

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

    const duplicate = await User.findOne({
        username,
        googleId: { $exists: false },
    })
        .lean()
        .exec()

    if (duplicate) {
        res.status(409).json({ message: "User already exists!" })
        return
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const userData = { username, password: hashedPwd }

    const user = await User.create(userData)

    if (user) {
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        res.cookie("jwt", refreshToken, cookieConfig)

        res.status(201).json({ accessToken })
    } else {
        res.status(400).json({ message: `Invalid user data received!` })
    }

    return
}
