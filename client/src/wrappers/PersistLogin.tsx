import { useMutation, useQuery, useQueryClient } from "react-query"
import { refresh } from "../api/auth"
import { useAuthStore } from "../stores/useAuthStore"
import { Outlet } from "react-router-dom"
import { Spinner } from "../components/Spinner"
import { useEffect, useRef } from "react"

export const PersistLogin = () => {
    const queryClient = useQueryClient()
    const { setToken, token, persist } = useAuthStore()

    const effectRan = useRef(false)

    const { isLoading } = useQuery(["auth"], () => refresh(), {
        onSuccess: (res) => {
            queryClient.invalidateQueries(["auth"])
            if (!token && persist) {
                setToken(res.accessToken)
                effectRan.current = true
            }
        },
        retry: false,
        enabled: !effectRan.current,
    })

    useEffect(() => {
        if (!effectRan.current && !isLoading) {
            effectRan.current = true
        }
    }, [isLoading])

    return (
        <>
            {!persist ? (
                <Outlet />
            ) : isLoading ? (
                <Spinner className="absolute top-32 left-1/2 -translate-x-1/2" />
            ) : (
                <Outlet />
            )}
        </>
    )
}
