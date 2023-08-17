import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { useStore } from "@/stores/useStore"
import { Toast } from "@/components/ui/Toast"
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
                <Outlet />
            </main>
        </>
    )
}
