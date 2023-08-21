import { Invoice, InvoiceItem } from "@/types"
import { nanoid } from "nanoid"
import { useFormValidation } from "./useFormValidation"
import { OnChangeEvent } from "@/components/forms/InvoiceForm"
import { RefObject, SetStateAction } from "react"
import { invoiceSchema } from "@/lib/validations/invoice"

type useInvoiceFormProps = {
    formData: Invoice
    setFormData: (func: SetStateAction<Invoice>) => void
    formRef: RefObject<HTMLFormElement>
    onSubmit: () => void
}
export const useInvoiceForm = ({
    formRef,
    formData,
    setFormData,
    onSubmit,
}: useInvoiceFormProps) => {
    const { safeOnSubmit, errors } = useFormValidation({
        onSubmit,
        formData,
        zodSchema: invoiceSchema,
    })

    const onAddItem = () => {
        const newItem: InvoiceItem = {
            name: "",
            quantity: 0,
            price: 0,
            id: nanoid(),
        }
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, newItem],
        }))
        setTimeout(() => {
            formRef.current &&
                formRef.current.scrollTo({
                    top: 99999,
                    behavior: "smooth",
                })
        }, 100)
    }

    const onSelectedDayChange = (day: Date) => {
        setFormData((prev) => ({ ...prev, date: day }))
    }

    const onDeleteItem = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.id !== id),
        }))
    }

    const onChange = (e: OnChangeEvent) => {
        const { name, value } = e.target
        if (name.includes(":")) {
            const newName = name.split(":")
            const firstName = newName[0]!
            const secondName = newName[1]
            if (firstName && secondName) {
                setFormData((prev) => ({
                    ...prev,
                    [firstName]: {
                        ...(prev[firstName as keyof Invoice] as Record<
                            string,
                            string
                        >),
                        [secondName]: value,
                    },
                }))
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const onItemChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: string
    ) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          [name]: type === "number" ? +value : value,
                      }
                    : item
            ),
        }))
    }

    const onSelectChange = (name: string, option: string) => {
        setFormData((prev) => ({ ...prev, [name]: option }))
    }

    return {
        onAddItem,
        onDeleteItem,
        onChange,
        onItemChange,
        onSelectChange,
        onSelectedDayChange,
        safeOnSubmit,
        errors,
    }
}
