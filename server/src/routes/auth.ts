import express from "express"
const router = express.Router({ mergeParams: true })
import { loginLimiter, validateAuth } from "../middleware"
import { login, refresh, logout, googleLogin } from "../controllers/auth"

router.route("/").post(loginLimiter, validateAuth, login)
router.route("/google-login").post(googleLogin)

router.route("/refresh").get(refresh)

router.route("/logout").post(logout)

export default router
