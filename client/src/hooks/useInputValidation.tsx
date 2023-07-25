import { RefObject, useState } from "react"

export const useInputValidation = (
    formRef: RefObject<HTMLFormElement>,
    itemsRef?: RefObject<HTMLDivElement>
) => {
    const [errors, setErrors] = useState<string[]>([])

    const makeInputValid = (name: string) => {
        setErrors((prev) => prev.filter((errName) => errName !== name))
    }

    const makeItemInputValid = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, dataset } = e.target
        setErrors((prev) =>
            prev.filter((errName) => errName !== name + dataset.idx)
        )
    }

    const validateInputs = () => {
        if (formRef.current) {
            const inputs =
                formRef.current.querySelectorAll<HTMLInputElement>(".input")
            inputs.forEach((input: HTMLInputElement) => {
                if (!input.checkValidity() || input.value.length === 0) {
                    setErrors((prev) => [...prev, input.name])
                    setErrors((prev) => [...new Set(prev)])
                } else if (input.checkValidity() && input.value.length !== 0) {
                    setErrors((prev) => [
                        ...new Set(prev.filter((name) => name !== input.name)),
                    ])
                }
            })
        }

        if (itemsRef?.current) {
            const itemsInputs =
                itemsRef.current.querySelectorAll<HTMLInputElement>(
                    ".item-input"
                )
            itemsInputs.forEach((input: HTMLInputElement) => {
                if (!input.checkValidity() || input.value.length === 0) {
                    setErrors((prev) => [
                        ...prev,
                        input.name + input.dataset.idx,
                    ])
                    setErrors((prev) => [...new Set(prev)])
                } else if (input.checkValidity() && input.value.length !== 0) {
                    setErrors((prev) => [
                        ...new Set(
                            prev.filter(
                                (name) =>
                                    name !== input.name + input.dataset.idx
                            )
                        ),
                    ])
                }
            })
        }
    }
    return {
        errors,
        makeInputValid,
        makeItemInputValid,
        validateInputs,
    }
}
