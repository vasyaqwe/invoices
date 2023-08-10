import { RefObject, useEffect, useState } from "react"

export const useFormValidation = (formRef: RefObject<HTMLFormElement>) => {
    const [errors, setErrors] = useState<string[]>([])

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
            const { id } = e.target as HTMLInputElement
            setErrors((prev) => prev.filter((errName) => errName !== id))
        }

        const inputs =
            formRef?.current?.querySelectorAll<HTMLInputElement>(".input")

        if (inputs) {
            inputs.forEach((input: HTMLInputElement) => {
                if (errors.includes(input.id)) {
                    input.addEventListener("input", makeInputValid)
                }
            })
        }

        return () => {
            if (inputs) {
                inputs.forEach((input: HTMLInputElement) =>
                    input.removeEventListener("input", makeInputValid)
                )
            }
        }
    }, [formRef, errors])

    return {
        errors,
        validateInputs,
        makeValidOnDeleteItem,
    }
}
