import axios from "axios"
export const API_URL = "https://invoices-ga5s.onrender.com"
import { useAuthStore } from "../stores/useAuthStore"
import { refresh } from "./auth"

export const ROLES = {
    Employee: "Employee",
    Manager: "Manager",
    Admin: "Admin",
}

function getCurrentAccessToken() {
    return useAuthStore.getState().token
}

export default axios.create({ baseURL: API_URL })

export const axiosPrivate = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
})

axiosPrivate.interceptors.request.use(
    (config) => {
        if (!config.headers["Authorization"]) {
            config.headers[
                "Authorization"
            ] = `Bearer ${getCurrentAccessToken()}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const prevReq = error?.config
        if (error?.response?.status === 403 && !prevReq?.sent) {
            prevReq.sent = true
            const refreshedRes = await refresh()
            prevReq.headers[
                "Authorization"
            ] = `Bearer ${refreshedRes.data.accessToken}`
            console.log(refreshedRes.data.accessToken)
            return axiosPrivate(prevReq)
        }
        return Promise.reject(error)
    }
)
