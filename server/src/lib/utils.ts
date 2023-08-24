import { CookieOptions } from "express"
import { Secret } from "jsonwebtoken"
import jwt from "jsonwebtoken"
import { Document } from "mongoose"
import { User } from "../models/User"

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as Secret
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as Secret

export const accessTokenExpiresIn = "15m"
export const refreshTokenExpiresIn = "7d"
export const cookieMaxAge = 7 * 24 * 60 * 60 * 1000

export const rawCookieConfig: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "none",
}
// safari doesn't allow third-party cookies, hence secure must be false to make it work

export const cookieConfig: CookieOptions = {
    ...rawCookieConfig,
    maxAge: cookieMaxAge,
}

export const generateAccessToken = (user: User & Document) => {
    const payload = {
        userId: user._id,
        username: user.username,
    }

    return jwt.sign(payload, accessTokenSecret, {
        expiresIn: accessTokenExpiresIn,
    })
}

export const generateRefreshToken = (user: User & Document) => {
    const payload = {
        userId: user._id,
        username: user.username,
    }

    return jwt.sign(payload, refreshTokenSecret, {
        expiresIn: refreshTokenExpiresIn,
    })
}
