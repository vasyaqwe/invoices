import { Link, Outlet } from "react-router-dom"
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
                <p className="fixed p-2 text-sm rounded-md bg-primary-800 bottom-5 right-5">
                    Created by{" "}
                    <Link
                        className="underline link"
                        target="_blank"
                        to={
                            "https://www.upwork.com/freelancers/~015c1b113a62e11b13"
                        }
                    >
                        Vasyl P
                    </Link>
                    . Source code available on{" "}
                    <Link
                        target="_blank"
                        className="underline link"
                        to="https://github.com/vasyaqwe/invoices"
                    >
                        GitHub
                    </Link>
                </p>

                <Toast />
                <Outlet />
            </main>
        </>
    )
}
