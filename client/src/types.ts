import { Invoice } from "../../common/types"

export type InvoiceFormData = Omit<Invoice, "id"> & Record<string, any>

export type PaginatedInvoiceReturnType = Promise<{
    totalPages: number
    page: number
    invoices: Invoice[]
}>

export type InvoiceReturnType = Promise<Invoice>

export type UserCredentials = {
    username: string
    password: string
}
