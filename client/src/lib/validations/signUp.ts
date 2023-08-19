import * as z from "zod"
import { userSchema } from "./user"

export const signUpSchema = z
    .object({
        username: userSchema.shape.username,
        password: userSchema.shape.password,
        confirmPassword: userSchema.shape.password,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "nomessage",
        path: ["password"],
    })
