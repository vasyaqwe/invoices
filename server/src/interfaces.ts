import { Request } from 'express'
export interface DecodedToken {
    username: string
    [key: string]: unknown
}