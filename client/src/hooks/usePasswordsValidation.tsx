import { RefObject, useState } from "react"

export const usePasswordsValidation = (formRef: RefObject<HTMLFormElement>) => {
    const [passwordsMatch, setPasswordsMatch] = useState(true)

    const validateInputs = () => {
        if (formRef.current) {
            const password1 =
                formRef.current.querySelector<HTMLInputElement>(
                    '[name="password1"]'
                )
            const password2 =
                formRef.current.querySelector<HTMLInputElement>(
                    '[name="password2"]'
                )

            if (password1 && password2) {
                if (password1.value !== password2.value) {
                    setPasswordsMatch(false)
                } else {
                    setPasswordsMatch(true)
                }
            }
        }
    }

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (formRef.current) {
            if (name === "password1") {
                if (value === formRef.current.password2.value) {
                    setPasswordsMatch(true)
                } else {
                    setPasswordsMatch(false)
                }
            } else if (name === "password2") {
                if (value === formRef.current.password1.value) {
                    setPasswordsMatch(true)
                } else {
                    setPasswordsMatch(false)
                }
            }
        }
    }

    return { passwordsMatch, onPasswordChange, validateInputs }
}
