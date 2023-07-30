import { useRef, useState } from "react"
import { InvoiceFormData } from "../../types"
import { createInvoice, createInvoiceDraft } from "../../api/invoices"
import { useMutation, useQueryClient } from "react-query"
import { motion } from "framer-motion"
import { useErrorToast } from "../../hooks/useErrorToast"
import { useStore } from "../../stores/useStore"
import { nanoid } from "nanoid"
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../Button"
import { InvoiceForm } from "../InvoiceForm"
import { useInvoiceForm } from "../../hooks/useInvoiceForm"
import { PaymentTerms, Status } from "../../../../common/types"

export const CreateInvoiceModal = () => {
    const { closeModal, openToast } = useStore()

    const currentUser = useAuth()

    const [draft, setDraft] = useState(false)

    const today = Date.now()

    const [formData, setFormData] = useState<InvoiceFormData>({
        user: currentUser!.userId,
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
        status: Status.Pending,
        paymentTerms: PaymentTerms.OneDay,
        description: "",
        items: [{ name: "", price: 0, quantity: 0, id: nanoid() }],
    })

    const formRef = useRef<HTMLFormElement>(null)
    const itemsRef = useRef<HTMLDivElement>(null)

    const {
        onAddItem,
        onDeleteItem,
        onChange,
        onItemChange,
        onSelectChange,
        onSelectedDayChange,
        errors,
        validateInputs,
    } = useInvoiceForm({ setFormData, formData, itemsRef, formRef })

    const queryClient = useQueryClient()

    const {
        isLoading,
        error,
        mutate: onSave,
    } = useMutation(() => createInvoice(formData), {
        onSuccess: () => {
            queryClient.invalidateQueries(["invoices"])
            closeModal("createInvoice")
            openToast({ text: "Invoice created!" })
        },
    })

    const { mutate: onSaveAsDraft } = useMutation(
        () => createInvoiceDraft({ ...formData, status: Status.Draft }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["invoices"])
                closeModal("createInvoice")
            },
        }
    )

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSave()
    }

    useErrorToast(error)

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
                <h2 className="mb-4 text-4xl font-bold text-white">
                    Create Invoice
                </h2>
                <InvoiceForm
                    draft={draft}
                    formData={formData}
                    onSubmit={onSubmit}
                    errors={errors}
                    formRef={formRef}
                    itemsRef={itemsRef}
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
                        className="bg-primary-600"
                    >
                        Discard
                    </Button>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            onClick={() => {
                                setDraft(true)
                                onSaveAsDraft()
                                closeModal("createInvoice")
                                openToast({ text: "Draft saved!" })
                            }}
                            className=" bg-neutral-700"
                        >
                            Save as Draft
                        </Button>

                        <Button
                            form="invoice-form"
                            onClick={validateInputs}
                            disabled={isLoading}
                            isLoading={isLoading}
                            className={`bg-accent-700`}
                        >
                            Save & Send
                        </Button>
                    </div>
                </div>
            </div>
        </motion.dialog>
    )
}
