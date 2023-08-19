import { useStore } from "@/stores/useStore"
import { RefObject, useEffect, useState } from "react"
import { AnyZodObject, ZodEffects, ZodIssueBase } from "zod"

export type ValidationErrors = Record<string, string>

export const useFormValidation = <TFormData,>({
    formRef,
    formData,
    zodSchema,
}: {
    formRef: RefObject<HTMLFormElement>
    formData: TFormData
    zodSchema: ZodEffects<any> | AnyZodObject
}) => {
    const { modals } = useStore()
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [formSubmitted, setFormSubmitted] = useState(false)

    useEffect(() => {
        const onSubmit = () => setFormSubmitted(true)

        formRef.current?.addEventListener("submit", onSubmit)

        return () => {
            formRef.current?.removeEventListener("submit", onSubmit)
        }
    }, [modals])

    useEffect(() => {
        validate(formData)
    }, [formData])

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

    const validate = (formData: TFormData) => {
        const res = zodSchema.safeParse(formData)
        if (!res.success) {
            const errorsArr = JSON.parse(res.error.message)

            const transformedObject = errorsArr.reduce(
                (result: Record<string, string>, e: ZodIssueBase) => {
                    const key = getInputIdFromErrors(e)
                    const message = e.message
                    if (message) {
                        result[key] = message
                    }
                    return result
                },
                {}
            )
            setErrors(transformedObject)
        } else {
            setErrors({})
        }
    }

    return {
        errors: formSubmitted ? errors : {},
        canSubmit: Object.keys(errors).length < 1,
    }
}
