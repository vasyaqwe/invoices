import express from "express"
const router = express.Router({ mergeParams: true })
import { loginLimiter, validateAuth } from "../middleware"
import { login, refresh, logout, googleLogin } from "../controllers/auth"
import asyncHandler from "express-async-handler"

router.route("/").post(loginLimiter, validateAuth, asyncHandler(login))
router.route("/google-login").post(asyncHandler(googleLogin))

router.route("/refresh").get(refresh)

router.route("/logout").post(logout)

export default router
