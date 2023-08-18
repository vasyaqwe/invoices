import User from "../models/User"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Request, Response } from "express"
import { DecodedToken } from "../types/types"
import { OAuth2Client } from "google-auth-library"
import {
    accessTokenExpiresIn,
    accessTokenSecret,
    cookieConfig,
    rawCookieConfig,
    refreshTokenExpiresIn,
    refreshTokenSecret,
} from "../lib/utils"

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
)

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body

    const foundUser = await User.findOne({
        username,
        googleId: { $exists: false },
    })

    if (!foundUser) {
        res.status(401).json({ message: "This username is not registered" })
        return
    }

    const match = await bcrypt.compare(password, foundUser.password!)

    if (!match) {
        res.status(401).json({ message: "Invalid Credentials" })
        return
    }

    const accessToken = jwt.sign(
        {
            userId: foundUser._id,
            username: foundUser.username,
        },
        accessTokenSecret,
        { expiresIn: accessTokenExpiresIn }
    )

    const refreshToken = jwt.sign(
        {
            userId: foundUser._id,
            username: foundUser.username,
        },
        refreshTokenSecret,
        { expiresIn: refreshTokenExpiresIn }
    )

    res.cookie("jwt", refreshToken, cookieConfig)

    res.json({ accessToken })
}

export const googleLogin = async (req: Request, res: Response) => {
    const { code } = req.body
    const { tokens } = await oAuth2Client.getToken(code)

    if (!tokens) {
        res.status(400).json({ message: "Invalid google sign in payload" })
        return
    }

    const ticket = await oAuth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.YOUR_GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    if (!payload) {
        res.status(400).json({ message: "Invalid google sign in payload" })
        return
    }

    const username = payload.given_name

    const foundUser = await User.findOne({
        username,
        googleId: { $exists: true },
    })

    if (!foundUser) {
        const duplicate = await User.findOne({
            username,
            googleId: { $exists: true },
        })
            .lean()
            .exec()

        if (duplicate) {
            res.status(409).json({ message: "User already exists!" })
            return
        }

        const user = await User.create({ username, googleId: payload.sub })

        if (user) {
            const accessToken = jwt.sign(
                { userId: user._id, username: user.username },
                accessTokenSecret,
                { expiresIn: accessTokenExpiresIn }
            )

            const refreshToken = jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                },
                refreshTokenSecret,
                { expiresIn: refreshTokenExpiresIn }
            )

            res.cookie("jwt", refreshToken, cookieConfig)

            res.status(201).json({ accessToken })
        } else {
            res.status(400).json({ message: `Invalid user data received!` })
        }
        return
    }

    const match = payload.sub === foundUser.googleId

    if (!match) {
        res.status(401).json({
            message:
                "Google credentials mismatch. This might be a security breach.",
        })
        return
    }

    const accessToken = jwt.sign(
        {
            userId: foundUser._id,
            username: foundUser.username,
        },
        accessTokenSecret,
        { expiresIn: accessTokenExpiresIn }
    )

    const refreshToken = jwt.sign(
        {
            userId: foundUser._id,
            username: foundUser.username,
        },
        refreshTokenSecret,
        { expiresIn: refreshTokenExpiresIn }
    )

    res.cookie("jwt", refreshToken, cookieConfig)

    res.json({ accessToken })
}

export const refresh = async (req: Request, res: Response) => {
    const cookies = req.cookies

    if (!cookies?.jwt) {
        res.status(401).json({ message: "Unauthorized" })
        return
    }

    const refreshToken = cookies.jwt

    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as DecodedToken

    const foundUser = await User.findOne({
        username: decoded.username,
    }).exec()

    if (!foundUser) {
        res.status(401).json({ message: "Unauthorized" })
        return
    }

    const accessToken = jwt.sign(
        {
            userId: foundUser._id,
            username: foundUser.username,
        },
        accessTokenSecret,
        { expiresIn: accessTokenExpiresIn }
    )

    res.json({ accessToken })
}

export const logout = (req: Request, res: Response) => {
    const { cookies } = req

    if (!cookies?.jwt) {
        res.status(404).json({ message: "No cookies" })
        return
    }

    res.clearCookie("jwt", rawCookieConfig)

    res.json({ message: "Cookie cleared" })
}
