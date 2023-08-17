import { Invoice, InvoiceReturn, PaginatedInvoiceReturn } from "@/types"
import { axiosPrivate, axiosRequest } from "./config"

export const getInvoices = async (page: number): PaginatedInvoiceReturn =>
    axiosRequest(() => axiosPrivate.get(`/invoices?page=${page}`))

export const getInvoice = async (id: string): InvoiceReturn =>
    axiosRequest(() => axiosPrivate.get(`/invoices/${id}`))

export const createInvoice = async (data: Invoice) =>
    axiosRequest(() => axiosPrivate.post(`/invoices/`, data))

export const createInvoiceDraft = async (data: Invoice) =>
    axiosRequest(() => axiosPrivate.post(`/invoices/draft`, data))

export const updateInvoice = async (id: string, data: Invoice) =>
    axiosRequest(() => axiosPrivate.patch(`/invoices/${id}`, data))

export const deleteInvoice = async (id: string) =>
    axiosRequest(() => axiosPrivate.delete(`/invoices/${id}`))
