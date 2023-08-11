import { useStore } from "@/stores/useStore"
import { useEffect } from "react"

export const useErrorToast = (error: unknown) => {
    const { openToast } = useStore()

    useEffect(() => {
        if (error instanceof Error)
            openToast({ text: error.message, error: true })
    }, [error])
}
