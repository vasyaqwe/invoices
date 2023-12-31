import { useRef, useState } from "react"
import { Invoice } from "@/types"
import { updateInvoice } from "@/api/invoices"
import { useMutation, useQueryClient } from "react-query"
import { motion } from "framer-motion"
import { useStore } from "@/stores/useStore"
import { useErrorToast } from "@/hooks/useErrorToast"
import { Button } from "../ui/Button"
import { InvoiceForm } from "../forms/InvoiceForm"
import { useInvoiceForm } from "@/hooks/useInvoiceForm"
import { ModalWrapper } from "./ModalWrapper"

export const EditInvoiceModal = ({ invoice }: { invoice: Invoice }) => {
    const { billFrom, billTo, items, date, status, paymentTerms, description } =
        invoice

    const { closeModal, openToast, modals } = useStore()

    const [formData, setFormData] = useState<Invoice>({
        billFrom: billFrom,
        billTo: billTo,
        date: new Date(date),
        status,
        paymentTerms,
        description,
        items,
    })

    const formRef = useRef<HTMLFormElement>(null)

    const queryClient = useQueryClient()

    const {
        isLoading,
        error,
        mutate: onSave,
    } = useMutation(
        () =>
            updateInvoice(invoice?.id ?? "", {
                ...formData,
                status: "Pending",
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["invoices", invoice.id])
                closeModal("editInvoice")
                openToast({ text: "Invoice updated!" })
            },
        }
    )

    useErrorToast(error)

    const {
        onAddItem,
        onDeleteItem,
        onChange,
        onItemChange,
        onSelectChange,
        errors,
        onSelectedDayChange,
        safeOnSubmit,
    } = useInvoiceForm({ setFormData, formData, formRef, onSubmit: onSave })

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        safeOnSubmit()
    }

    return (
        <ModalWrapper open={modals["editInvoice"]}>
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
                    <h2 className="mb-4 text-4xl font-bold text-white">
                        Edit Invoice
                    </h2>

                    <InvoiceForm
                        formData={formData}
                        onSubmit={onSubmit}
                        errors={errors}
                        formRef={formRef}
                        onSelectChange={onSelectChange}
                        onSelectedDayChange={onSelectedDayChange}
                        onChange={onChange}
                        onItemChange={onItemChange}
                        onAddItem={onAddItem}
                        onDeleteItem={onDeleteItem}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 py-6">
                        <Button
                            type="button"
                            onClick={() => closeModal("editInvoice")}
                            variant="faded"
                        >
                            Cancel
                        </Button>
                        <Button
                            form="invoice-form"
                            disabled={isLoading}
                            isLoading={isLoading}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </motion.dialog>
        </ModalWrapper>
    )
}
