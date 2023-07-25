import express from "express"
const router = express.Router({ mergeParams: true })
import { loginLimiter, validateAuth } from "../middleware"
import { login, refresh, logout } from "../controllers/auth"
import asyncHandler from "express-async-handler"

router.route("/").post(loginLimiter, validateAuth, asyncHandler(login))

router.route("/refresh").get(refresh)

router.route("/logout").post(logout)

export default router
