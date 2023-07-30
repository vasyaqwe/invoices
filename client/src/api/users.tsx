import { UserCredentials } from "../types"
import { axiosPrivate } from "./config"
import axios from "axios"

export const getUsers = async () => {
    try {
        const res = await axiosPrivate.get(`/users`)
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}
export const getUser = async (id: string) => {
    try {
        const res = await axiosPrivate.get(`/users/${id}`)
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}
export const createUser = async (data: UserCredentials) => {
    try {
        const res = await axiosPrivate.post(`/users`, data)
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}
export const updateUser = async (id: string, data: UserCredentials) => {
    try {
        const res = await axiosPrivate.patch(`/users/${id}`, data)
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}

export const deleteUser = async (id: string) => {
    try {
        const res = await axiosPrivate.delete(`/users/${id}`)
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}
