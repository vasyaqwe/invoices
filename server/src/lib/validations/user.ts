import * as z from "zod"

export const userSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters",
    }),
    password: z.string().min(3, {
        message: "Password must be at least 3 characters",
    }),
    googleId: z.string().optional(),
})
