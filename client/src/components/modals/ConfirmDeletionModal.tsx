import { motion } from "framer-motion"
import { useStore } from "@/stores/useStore"
import { useMutation, useQueryClient } from "react-query"
import { deleteInvoice } from "@/api/invoices"
import { useNavigate } from "react-router-dom"
import { useErrorToast } from "@/hooks/useErrorToast"
import { Button } from "../ui/Button"
import { Invoice } from "@/types"
import { ModalWrapper } from "@/wrappers/ModalWrapper"

export const ConfirmDeletionModal = ({ invoice }: { invoice: Invoice }) => {
    const { closeModal, openToast, modals } = useStore()

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const {
        isLoading,
        error,
        mutate: onDelete,
    } = useMutation(() => deleteInvoice(invoice?.id ?? ""), {
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
        <ModalWrapper open={modals["confirmDeletion"]}>
            <motion.dialog
                open
                className="inset-0 w-full max-w-lg p-12 m-auto bg-primary-700 modal"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
            >
                <h2 className="mb-4 text-4xl font-bold text-white">
                    Confirm deletion
                </h2>
                <p className="text-neutral-400">
                    Are you sure you want to delete invoice #
                    {invoice?.id?.toUpperCase()}? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-2 mt-3">
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
        </ModalWrapper>
    )
}
