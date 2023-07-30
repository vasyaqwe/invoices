import { Link, useNavigate } from "react-router-dom"
import logo from "../assets/logo.svg"
import { useErrorToast } from "../hooks/useErrorToast"
import { useMutation, useQueryClient } from "react-query"
import { logout } from "../api/auth"
import { Spinner } from "./Spinner"
import { useAuthStore } from "../stores/useAuthStore"

export const Sidebar = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { token, setToken } = useAuthStore()

    const {
        isLoading,
        error,
        mutate: onLogout,
    } = useMutation(() => logout(), {
        onSuccess: () => {
            queryClient.invalidateQueries(["auth"])
            navigate("/login")
            setToken(null)
        },
    })

    useErrorToast(error)

    return (
        <aside className="h-[80px] md:h-full bg-primary-800 z-50 ">
            <div className="sticky top-0 h-[80px] md:h-screen  flex items-center justify-between md:flex-col">
                <div className="w-[80px] h-full md:h-[100px] md:w-[100px] bg-accent-400 grid place-items-center rounded-r-2xl">
                    <img
                        className="md:w-[35px] md:h-[35px]"
                        src={logo}
                        alt="Invoices logo"
                    />
                </div>
                {token && (
                    <button
                        onClick={() => onLogout()}
                        disabled={isLoading}
                        className="mr-4 md:mb-7 md:mr-0 hover:underline hover:text-accent-400 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && <Spinner />}
                        Log out
                    </button>
                )}
                {!token && (
                    <div className="flex flex-col gap-4 mr-4 md:mb-7 md:mr-0 ">
                        <Link
                            to={"/signup"}
                            className="hover:underline hover:text-accent-400 flex items-center gap-2"
                        >
                            Sign up
                        </Link>
                        <Link
                            to={"/login"}
                            className="hover:underline hover:text-accent-400 flex items-center gap-2"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    )
}
