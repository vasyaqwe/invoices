import express from "express"
const router = express.Router({ mergeParams: true })
import { createUser, getUsers } from "../controllers/users"
import { validateUser, isLoggedIn } from "../middleware"

router.route("/").get(isLoggedIn, getUsers).post(validateUser, createUser)

export default router
