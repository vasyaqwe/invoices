import express from "express"
const router = express.Router({ mergeParams: true })
import { createUser, getUsers } from "../controllers/users"
import { isLoggedIn, zParse } from "../middleware"
import { userSchema } from "../lib/validations/user"

router.route("/").get(isLoggedIn, getUsers).post(zParse(userSchema), createUser)

export default router
