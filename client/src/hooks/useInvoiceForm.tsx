import { Invoice, InvoiceItem } from "../types"
import { nanoid } from "nanoid"
import { useFormValidation } from "./useFormValidation"
import { OnChangeEvent } from "../components/forms/InvoiceForm"
import { SelectOption } from "../components/ui/Select"
import { RefObject, SetStateAction } from "react"

type useInvoiceFormProps = {
    formData: Invoice
    setFormData: (func: SetStateAction<Invoice>) => void
    itemsRef: RefObject<HTMLDivElement>
    formRef: RefObject<HTMLFormElement>
}
export const useInvoiceForm = ({
    formRef,
    itemsRef,
    formData,
    setFormData,
}: useInvoiceFormProps) => {
    const { validateInputs, makeValidOnDeleteItem, errors } = useFormValidation(
        formRef,
        itemsRef
    )

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
        const removedRow = formData.items.find((t) => t.id === id)
        if (removedRow) {
            const removedRowIdx = formData.items.indexOf(removedRow)
            makeValidOnDeleteItem("name" + removedRowIdx)
            makeValidOnDeleteItem("quantity" + removedRowIdx)
            makeValidOnDeleteItem("price" + removedRowIdx)
        }
    }

    const onChange = (e: OnChangeEvent) => {
        const { name, value } = e.target
        if (name.includes(":")) {
            const newName = name.split(":")
            const firstName = newName[0]
            const secondName = newName[1]
            setFormData((prev) => ({
                ...prev,
                [firstName]: {
                    ...prev[firstName],
                    [secondName]: value,
                },
            }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }

    const onItemChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: string
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.id === id ? { ...item, [name]: value } : item
            ),
        }))
    }

    const onSelectChange = (name: string, option: SelectOption) => {
        setFormData((prev) => ({ ...prev, [name]: option }))
    }

    return {
        onAddItem,
        onDeleteItem,
        onChange,
        onItemChange,
        onSelectChange,
        onSelectedDayChange,
        validateInputs,
        errors,
    }
}
