import * as z from "zod"

export const userSchema = z.object({
    username: z
        .string()
        .min(4, {
            message: "Username must be at least 4 characters",
        })
        .refine((value) => !value, {
            message: "Username is required",
        }),
    password: z
        .string()
        .min(6, {
            message: "Password must be at least 6 characters",
        })
        .refine((value) => !value, {
            message: "Password is required",
        }),
})
