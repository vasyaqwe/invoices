import { RefObject, useEffect, useState } from "react"

export const useFormValidation = (formRef: RefObject<HTMLFormElement>) => {
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

    const makeValidOnDeleteItem = (name: string) =>
        setErrors((prev) => prev.filter((errName) => errName !== name))

    const validateInputs = () => {
        if (formRef.current) {
            const inputs =
                formRef.current.querySelectorAll<HTMLInputElement>(".input")

            inputs.forEach((input: HTMLInputElement) => {
                if (!input.checkValidity() || input.value.length === 0) {
                    setErrors((prev) => [...prev, input.id])
                    setErrors((prev) => [...new Set(prev)])
                } else if (input.checkValidity() && input.value.length !== 0) {
                    setErrors((prev) => [
                        ...new Set(prev.filter((id) => id !== input.id)),
                    ])
                }
            })
        }
    }

    //remove from errors[] onChange
    useEffect(() => {
        const makeInputValid = (e: Event) => {
            const { id, value } = e.target as HTMLInputElement
            setErrors((prev) => prev.filter((errName) => errName !== id))

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
                if (errors.includes(input.id)) {
                    input.addEventListener("input", makeInputValid)
                }
            })
        }

        if (passwordInputs) {
            passwordInputs.forEach((input: HTMLInputElement) => {
                input.addEventListener("input", makeInputValid)
            })
        }

        return () => {
            if (inputs) {
                inputs.forEach((input: HTMLInputElement) =>
                    input.removeEventListener("input", makeInputValid)
                )
            }

            if (passwordInputs) {
                passwordInputs.forEach((input: HTMLInputElement) =>
                    input.removeEventListener("input", makeInputValid)
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
