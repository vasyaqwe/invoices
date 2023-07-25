import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/Sidebar"
import { CreateInvoiceModal } from "../components/Modals/CreateInvoiceModal"
import { useStore } from "../stores/useStore"
import { ModalWrapper } from "../wrappers/ModalWrapper"
import { ConfirmDeletionModal } from "../components/Modals/ConfirmDeletionModal"
import { Toast } from "../components/Toast"

export const Layout = () => {
    const { modals } = useStore()

    return (
        <>
            <Sidebar />
            <main className="max-w-3xl w-full h-full px-5 mx-auto pt-5 md:pt-14 relative min-h-[calc(100vh-80px)] md:min-h-screen">
                <Toast />
                <ModalWrapper open={modals.createInvoice}>
                    <CreateInvoiceModal />
                </ModalWrapper>

                <ModalWrapper open={modals.confirmDeletion}>
                    <ConfirmDeletionModal />
                </ModalWrapper>

                <Outlet />
            </main>
        </>
    )
}
