import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/Sidebar"
import { CreateInvoiceModal } from "../components/Modals/CreateInvoiceModal"
import { useStore } from "../stores/useStore"
import { ModalWrapper } from "../wrappers/ModalWrapper"
import { Toast } from "../components/Toast"
import { useEffect } from "react"

export const Layout = () => {
    const { modals } = useStore()

    useEffect(() => {
        if (Object.values(modals).some((v) => v)) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }, [modals])

    return (
        <>
            <Sidebar />
            <main className="max-w-3xl w-full h-full px-5 mx-auto pt-5 md:pt-14 relative min-h-[calc(100vh-80px)] md:min-h-screen">
                <Toast />

                <ModalWrapper open={modals.createInvoice}>
                    <CreateInvoiceModal />
                </ModalWrapper>

                <Outlet />
            </main>
        </>
    )
}
