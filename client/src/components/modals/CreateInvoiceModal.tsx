import { useRef, useState } from "react"
import { Invoice } from "@/types"
import { createInvoice, createInvoiceDraft } from "@/api/invoices"
import { useMutation, useQueryClient } from "react-query"
import { motion } from "framer-motion"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useStore } from "@/stores/useStore"
import { nanoid } from "nanoid"
import { Button } from "../ui/Button"
import { InvoiceForm } from "../forms/InvoiceForm"
import { useInvoiceForm } from "@/hooks/useInvoiceForm"
import { ModalWrapper } from "./ModalWrapper"

const today = Date.now()

const initialFormData = {
    billFrom: {
        streetAddress: "",
        city: "",
        postCode: "",
        country: "",
    },
    billTo: {
        clientName: "",
        clientEmail: "",
        streetAddress: "",
        city: "",
        postCode: "",
        country: "",
    },
    date: new Date(today),
    status: "Pending" as const,
    paymentTerms: "Net 1 day" as const,
    description: "",
    items: [{ name: "", price: 0, quantity: 0, id: nanoid() }],
}

export const CreateInvoiceModal = () => {
    const { closeModal, openToast, modals } = useStore()

    const [formData, setFormData] = useState<Invoice>(initialFormData)

    const formRef = useRef<HTMLFormElement>(null)

    const queryClient = useQueryClient()

    const {
        isLoading,
        error,
        mutate: onSave,
    } = useMutation(() => createInvoice(formData), {
        onSuccess: () => {
            queryClient.invalidateQueries(["invoices"])
            closeModal("createInvoice")
            setFormData(initialFormData)
            openToast({ text: "Invoice created!" })
        },
    })

    const {
        onAddItem,
        onDeleteItem,
        onChange,
        onItemChange,
        onSelectChange,
        onSelectedDayChange,
        errors,
        safeOnSubmit,
    } = useInvoiceForm({ setFormData, formData, formRef, onSubmit: onSave })

    const { mutate: onSaveAsDraft } = useMutation(
        () => createInvoiceDraft({ ...formData, status: "Draft" }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["invoices"])
                setFormData(initialFormData)
                closeModal("createInvoice")
            },
        }
    )

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        safeOnSubmit()
    }

    useErrorToast(error)

    return (
        <ModalWrapper open={modals["createInvoice"]}>
            <motion.dialog
                open
                className="sheet modal modal--screen"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
            >
                <div
                    className="grid grid-rows-[min-content,1fr,min-content] h-[calc(100vh-80px)] md:h-full
            p-7 md:p-12"
                >
                    <h2 className="mb-4 text-4xl font-bold text-white">
                        Create Invoice
                    </h2>
                    <InvoiceForm
                        formData={formData}
                        onSubmit={onSubmit}
                        errors={errors}
                        formRef={formRef}
                        onSelectedDayChange={onSelectedDayChange}
                        onSelectChange={onSelectChange}
                        onChange={onChange}
                        onItemChange={onItemChange}
                        onAddItem={onAddItem}
                        onDeleteItem={onDeleteItem}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 py-6">
                        <Button
                            type="button"
                            onClick={() => closeModal("createInvoice")}
                            variant="faded"
                        >
                            Discard
                        </Button>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                onClick={() => {
                                    onSaveAsDraft()
                                    closeModal("createInvoice")
                                    openToast({ text: "Draft saved!" })
                                }}
                                variant="neutral"
                            >
                                Save as Draft
                            </Button>

                            <Button
                                form="invoice-form"
                                disabled={isLoading}
                                isLoading={isLoading}
                            >
                                Save & Send
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.dialog>
        </ModalWrapper>
    )
}
