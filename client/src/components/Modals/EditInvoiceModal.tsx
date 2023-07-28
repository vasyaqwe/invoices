import { useRef, useState } from "react"
import { Invoice, InvoiceFormData } from "../../types"
import { updateInvoice } from "../../api/invoices"
import { useMutation, useQueryClient } from "react-query"
import { motion } from "framer-motion"
import { useStore } from "../../stores/useStore"
import { useErrorToast } from "../../hooks/useErrorToast"
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../Button"
import { InvoiceForm } from "../InvoiceForm"
import { useInvoiceForm } from "../../hooks/useInvoiceForm"

export const EditInvoiceModal = ({ invoice }: { invoice: Invoice }) => {
    const { billFrom, billTo, items, date, status, paymentTerms, description } =
        invoice
    const { closeModal, openToast } = useStore()

    const currentUser = useAuth()

    const [formData, setFormData] = useState<InvoiceFormData>({
        user: currentUser!.userId,
        billFrom: billFrom,
        billTo: billTo,
        date: new Date(date),
        status,
        paymentTerms,
        description,
        items,
    })

    const formRef = useRef<HTMLFormElement>(null)
    const itemsRef = useRef<HTMLDivElement>(null)

    const queryClient = useQueryClient()

    const {
        isLoading,
        error,
        mutate: onSave,
    } = useMutation(() => updateInvoice(invoice.id, formData), {
        onSuccess: () => {
            queryClient.invalidateQueries(["invoices", invoice.id])
            closeModal("editInvoice")
            openToast({ text: "Invoice updated!" })
        },
    })

    useErrorToast(error)

    const {
        onAddItem,
        onDeleteItem,
        onChange,
        onItemChange,
        onSelectChange,
        errors,
        onSelectedDayChange,
        validateInputs,
    } = useInvoiceForm({ setFormData, formData, itemsRef, formRef })

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSave()
    }

    return (
        <motion.dialog
            open
            className="bg-primary-900 min-h-screen p-6 top-[80px] w-full max-w-2xl md:left-[100px] md:top-0 modal modal--screen"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
        >
            <div
                className="grid grid-rows-[min-content,1fr,min-content] h-[calc(100vh-80px)] md:h-full
            p-7 md:p-12"
            >
                <h2 className="text-white text-4xl font-bold mb-4">
                    Edit Invoice
                </h2>

                <InvoiceForm
                    formData={formData}
                    onSubmit={onSubmit}
                    errors={errors}
                    formRef={formRef}
                    itemsRef={itemsRef}
                    onSelectChange={onSelectChange}
                    onSelectedDayChange={onSelectedDayChange}
                    onChange={onChange}
                    onItemChange={onItemChange}
                    onAddItem={onAddItem}
                    onDeleteItem={onDeleteItem}
                />

                <div className="py-6 flex items-center justify-between flex-wrap gap-3">
                    <Button
                        type="button"
                        onClick={() => closeModal("editInvoice")}
                        className=" bg-primary-600"
                    >
                        Cancel
                    </Button>
                    <Button
                        form="invoice-form"
                        onClick={validateInputs}
                        disabled={isLoading}
                        isLoading={isLoading}
                        className={`bg-accent-700`}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </motion.dialog>
    )
}
