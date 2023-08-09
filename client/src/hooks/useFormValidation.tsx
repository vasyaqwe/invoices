import { RefObject, useEffect, useState } from "react"

export const useFormValidation = (
    formRef: RefObject<HTMLFormElement>,
    itemsRef?: RefObject<HTMLDivElement>
) => {
    const [errors, setErrors] = useState<string[]>([])

    const makeValidOnDeleteItem = (name: string) =>
        setErrors((prev) => prev.filter((errName) => errName !== name))

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

    useEffect(() => {
        const makeInputValid = (e: Event) => {
            const target = e.target as HTMLInputElement
            setErrors((prev) =>
                prev.filter((errName) => errName !== target.name)
            )
        }

        const makeItemInputValid = (e: Event) => {
            const { name, dataset } = e.target as HTMLInputElement
            setErrors((prev) =>
                prev.filter((errName) => errName !== name + dataset.idx)
            )
        }

        const inputs =
            formRef?.current?.querySelectorAll<HTMLInputElement>(".input")

        if (inputs) {
            inputs.forEach((input: HTMLInputElement) =>
                input.addEventListener("input", makeInputValid)
            )
        }
        const itemsInputs =
            itemsRef?.current?.querySelectorAll<HTMLInputElement>(".item-input")

        if (itemsInputs) {
            itemsInputs.forEach((input: HTMLInputElement) =>
                input.addEventListener("input", makeItemInputValid)
            )
        }

        return () => {
            if (inputs) {
                inputs.forEach((input: HTMLInputElement) =>
                    input.removeEventListener("input", makeInputValid)
                )
            }
            if (itemsInputs) {
                itemsInputs.forEach((input: HTMLInputElement) =>
                    input.removeEventListener("input", makeItemInputValid)
                )
            }
        }
    }, [formRef])

    return {
        errors,
        validateInputs,
        makeValidOnDeleteItem,
    }
}
