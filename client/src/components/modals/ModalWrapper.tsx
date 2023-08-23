import { useStore } from "@/stores/useStore"
import { AnimatePresence, motion } from "framer-motion"
import { ReactNode } from "react"

type ModalWrapperProps = {
    children: ReactNode
    open: boolean
}

export const ModalWrapper = ({ children, open }: ModalWrapperProps) => {
    const { onBackdropClick } = useStore()

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        onClick={() => onBackdropClick()}
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        className="modal-backdrop"
                    />
                    {children}
                </>
            )}
        </AnimatePresence>
    )
}
