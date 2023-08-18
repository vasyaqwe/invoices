import {
    invoiceItemSchema,
    paymentTermsSchema,
    statusSchema,
} from "@/lib/validations/invoice"
import { userSchema } from "@/lib/validations/user"
import * as z from "zod"

export type PaginatedInvoiceReturn = Promise<{
    totalPages: number
    page: number
    invoices: Invoice[]
}>

export type InvoiceReturn = Promise<Invoice>

export type Invoice = {
    id?: string
    billFrom: {
        streetAddress: string
        city: string
        postCode: string
        country: string
    }
    status: Status
    billTo: {
        clientName: string
        clientEmail: string
        streetAddress: string
        city: string
        postCode: string
        country: string
    }
    date: Date
    description: string
    paymentTerms: PaymentTerms
    items: InvoiceItem[]
}

export type PaymentTerms = z.infer<typeof paymentTermsSchema>

export type Status = z.infer<typeof statusSchema>

export type InvoiceItem = z.infer<typeof invoiceItemSchema>

export type User = z.infer<typeof userSchema>

export type UserFormData = User & { confirmPassword: string }
