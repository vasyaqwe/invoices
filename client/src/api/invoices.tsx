import {
    InvoiceFormData,
    InvoiceReturnType,
    PaginatedInvoiceReturnType,
} from "../types"
import { axiosPrivate } from "./config"
import axios from "axios"

export const getInvoices = async (page: number): PaginatedInvoiceReturnType => {
    try {
        const res = await axiosPrivate.get(`/invoices?page=${page}`)
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}
export const getInvoice = async (id: string): InvoiceReturnType => {
    try {
        const res = await axiosPrivate.get(`/invoices/${id}`)
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}
export const createInvoice = async (data: InvoiceFormData) => {
    try {
        const res = await axiosPrivate.post(`/invoices/`, { ...data })
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}
export const createInvoiceDraft = async (data: InvoiceFormData) => {
    try {
        const res = await axiosPrivate.post(`/invoices/draft`, { ...data })
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}
export const updateInvoice = async (id: string, data: InvoiceFormData) => {
    try {
        const res = await axiosPrivate.patch(`/invoices/${id}`, { ...data })
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}

export const deleteInvoice = async (id: string) => {
    try {
        const res = await axiosPrivate.delete(`/invoices/${id}`)
        return res.data
    } catch (e) {
        if (axios.isAxiosError(e)) {
            throw new Error(e.response?.data.message)
        } else {
            throw new Error("Unknown Error")
        }
    }
}
