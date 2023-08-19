import { RefObject, useEffect, useState } from "react"
import { AnyZodObject, ZodEffects, ZodIssueBase } from "zod"

export const useFormValidation = <TFormData,>({
    formRef,
    formData,
    zodSchema,
}: {
    formRef: RefObject<HTMLFormElement>
    formData: TFormData
    zodSchema: ZodEffects<AnyZodObject> | AnyZodObject
}) => {
    const [errors, setErrors] = useState<string[]>([])
    const [passwordsMatch, setPasswordsMatch] = useState(true)

    const validatePasswords = () => {
        if (formRef.current) {
            const password =
                formRef.current.querySelector<HTMLInputElement>(
                    '[name="password"]'
                )
            const confirmPassword =
                formRef.current.querySelector<HTMLInputElement>(
                    '[name="confirmPassword"]'
                )

            if (password && confirmPassword) {
                if (password.value !== confirmPassword.value) {
                    setPasswordsMatch(false)
                } else {
                    setPasswordsMatch(true)
                }
            }
        }
    }

    const makeValidOnDeleteItem = (inputId: string) =>
        setErrors((prev) => prev.filter((errId) => errId !== inputId))

    const getInputIdFromErrors = (e: ZodIssueBase) => {
        let inputId = ""
        if (e.path && e.path.length > 0) {
            if (e.path.length === 2) {
                inputId = e.path.join(":")
            } else if (e.path.length === 3) {
                inputId = e.path.slice(1, e.path.length).reverse().join("")
            } else {
                inputId = typeof e.path[0] === "string" ? e.path[0] : ""
            }
        }
        return inputId
    }

    const validateInputs = () => {
        if (formRef.current) {
            try {
                zodSchema.parse(formData)
            } catch (e: any) {
                e.errors.forEach((e: ZodIssueBase) => {
                    const inputId = getInputIdFromErrors(e)
                    if (inputId) {
                        setErrors((prev) => [...prev, inputId.toString()])
                        setErrors((prev) => [...new Set(prev)])
                    }
                })
            }
        }
    }

    //remove from errors[] onChange
    useEffect(() => {
        const makeInputValid = (e: Event) => {
            const { id } = e.target as HTMLInputElement
            setErrors((prev) => prev.filter((errName) => errName !== id))
        }

        const makePasswordsValid = (e: Event) => {
            const { id, value } = e.target as HTMLInputElement

            if (formRef.current) {
                if (id === "password") {
                    if (value === formRef.current.confirmPassword.value) {
                        setPasswordsMatch(true)
                    } else {
                        setPasswordsMatch(false)
                    }
                } else if (id === "confirmPassword") {
                    if (value === formRef.current.password.value) {
                        setPasswordsMatch(true)
                    } else {
                        setPasswordsMatch(false)
                    }
                }
            }
        }

        const inputs =
            formRef?.current?.querySelectorAll<HTMLInputElement>(".input")

        const passwordInputs =
            formRef?.current?.querySelectorAll<HTMLInputElement>(
                "[type=password]"
            )

        if (inputs) {
            inputs.forEach((input: HTMLInputElement) => {
                input.addEventListener("input", makeInputValid)
            })
        }
        if (passwordInputs && passwordInputs.length > 1) {
            passwordInputs.forEach((input: HTMLInputElement) => {
                input.addEventListener("input", makePasswordsValid)
            })
        }

        return () => {
            if (inputs) {
                inputs.forEach((input: HTMLInputElement) =>
                    input.removeEventListener("input", makeInputValid)
                )
            }

            if (passwordInputs && passwordInputs.length > 1) {
                passwordInputs.forEach((input: HTMLInputElement) =>
                    input.removeEventListener("input", makePasswordsValid)
                )
            }
        }
    }, [formRef, errors])

    return {
        errors,
        validateInputs,
        makeValidOnDeleteItem,
        validatePasswords,
        passwordsMatch,
    }
}
