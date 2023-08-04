import { User } from "../../../common/types"
import myAxios, { axiosPrivate } from "./config"
import axios from "axios"

export const refresh = async () => {
    const res = await axiosPrivate.get(`/auth/refresh`, {
        withCredentials: true,
    })
    return res.data
}

export const googleLogin = async (code: string) => {
    try {
        const res = await myAxios.post(
            `/auth/google-login`,
            { code },
            {
                withCredentials: true,
            }
        )
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}

export const login = async (credentials: User) => {
    try {
        const res = await myAxios.post(`/auth`, credentials, {
            withCredentials: true,
        })
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}

export const logout = async () => {
    try {
        return await axiosPrivate.post(`/auth/logout`, {
            withCredentials: true,
        })
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}
