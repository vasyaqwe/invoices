import { motion } from "framer-motion"
import { useStore } from "../../stores/useStore"
import { useMutation, useQueryClient } from "react-query"
import { deleteInvoice } from "../../api/invoices"
import { useNavigate } from "react-router-dom"
import { useErrorToast } from "../../hooks/useErrorToast"
import { Button } from "../ui/Button"
import { Invoice } from "../../types"

export const ConfirmDeletionModal = ({ invoice }: { invoice: Invoice }) => {
    const { closeModal, openToast } = useStore()

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const {
        isLoading,
        error,
        mutate: onDelete,
    } = useMutation(() => deleteInvoice(invoice.id), {
        onSuccess: () => {
            queryClient.invalidateQueries(["invoices"])
            queryClient.invalidateQueries(["invoices", invoice.id])
            closeModal("confirmDeletion")
            openToast({ text: "Invoice deleted!" })
            navigate("/")
        },
    })

    useErrorToast(error)

    return (
        <motion.dialog
            open
            className="bg-primary-700 inset-0 m-auto p-12 w-full max-w-lg modal"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
        >
            <h2 className="text-white text-4xl font-bold mb-4">
                Confirm deletion
            </h2>
            <p className="text-neutral-400">
                Are you sure you want to delete invoice #
                {invoice.id.toUpperCase()}? This action cannot be undone.
            </p>
            <div className="flex items-center gap-2 mt-3 justify-end">
                <Button
                    variant="neutral"
                    onClick={() => closeModal("confirmDeletion")}
                >
                    Cancel
                </Button>
                <Button
                    disabled={isLoading}
                    isLoading={isLoading}
                    variant={`danger`}
                    onClick={() => onDelete()}
                >
                    Delete
                </Button>
            </div>
        </motion.dialog>
    )
}