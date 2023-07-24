import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../stores/useAuthStore"
import { useStore } from "../stores/useStore"
import { useEffect } from 'react'

export const RequireAuth = () => {
    const { token } = useAuthStore()
    const { openToast } = useStore()

    const location = useLocation()

    const allowed = token !== null

    useEffect(() => {
        if (!allowed) openToast({ text: 'You must be logged in.', error: true })
    }, [allowed])

    const content = (
        allowed
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace={true} />
    )

    return content
}
