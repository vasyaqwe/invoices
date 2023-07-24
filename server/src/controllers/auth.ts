import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'
import { Request, Response } from 'express'
import { DecodedToken } from '../interfaces'

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as Secret
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as Secret

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body
    const foundUser = await User.findOne({ username })
    if (!foundUser) {
        res.status(401).json({ message: 'This username is not registered' })
        return
    }

    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) {
        res.status(401).json({ message: 'Invalid Credentials' })
        return
    }

    const accessToken = jwt.sign({
        userId: foundUser._id,
        username: foundUser.username,
    },
        accessTokenSecret,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        {
            userId: foundUser._id,
            username: foundUser.username
        },
        refreshTokenSecret,
        { expiresIn: '7d' }
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ accessToken })
}

export const refresh = (req: Request, res: Response) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })
    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        refreshTokenSecret,
        (err: unknown, decoded: any) => {
            if (err) {
                res.status(403).json({ message: err })
                return
            }
            const { username } = decoded as DecodedToken

            User.findOne({ username: username })
                .then((foundUser) => {
                    if (!foundUser) {
                        res.status(401).json({ message: 'Unauthorized' })
                        return
                    }

                    const accessToken = jwt.sign(
                        {
                            userId: foundUser._id,
                            username: foundUser.username
                        },
                        accessTokenSecret,
                        { expiresIn: '15m' }
                    )
                    res.json({ accessToken })
                })
                .catch((err) => {
                    res.status(500).json({ message: 'Internal Server Error' })
                })
        }
    )
}

export const logout = (req: Request, res: Response) => {
    const { cookies } = req
    if (!cookies?.jwt) return res.status(404).json({ message: 'No cookies' })
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

    res.json({ message: 'Cookie cleared' })
}