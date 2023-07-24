import express from 'express'
const router = express.Router({ mergeParams: true })
import { createUser, getUsers } from '../controllers/users'
import asyncHandler from "express-async-handler"
import { validateUser, isLoggedIn } from '../middleware'

router.route('/')
    .get(isLoggedIn, asyncHandler(getUsers))
    .post(validateUser, asyncHandler(createUser))

export default router