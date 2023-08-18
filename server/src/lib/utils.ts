import { CookieOptions } from "express"
import { Secret } from "jsonwebtoken"

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as Secret
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as Secret

export const accessTokenExpiresIn = "15m"
export const refreshTokenExpiresIn = "7d"
export const cookieMaxAge = 7 * 24 * 60 * 60 * 1000

export const rawCookieConfig: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
}

export const cookieConfig: CookieOptions = {
    ...rawCookieConfig,
    maxAge: cookieMaxAge,
}
