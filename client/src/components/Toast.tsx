import { useStore } from "../stores/useStore"
import { useEffect } from "react"

export const Toast = () => {
    const { toast, closeToast } = useStore()

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (toast.open) closeToast()
        }, 4000)

        return () => clearTimeout(timeout)
    }, [toast.open])

    return (
        <p className={`py-3 px-5 rounded-md w-fit z-[99] fixed left-1/2 -translate-x-1/2 top-5 -translate-y-[300%] ${toast.open ? 'translate-y-0' : ''}
        transition-all
        ${toast.alert ? 'alert' : ''} ${toast.error ? 'bg-danger-400' : 'bg-neutral-700'}`}>
            {toast.text}
        </p>
    )
}
