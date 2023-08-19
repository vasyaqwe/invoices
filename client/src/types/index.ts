import {
    invoiceItemSchema,
    invoiceSchema,
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

export type InvoiceItem = z.infer<typeof invoiceItemSchema>

export type Invoice = Omit<z.infer<typeof invoiceSchema>, "items"> & {
    items: InvoiceItem[]
}

export type PaymentTerms = z.infer<typeof paymentTermsSchema>

export type Status = z.infer<typeof statusSchema>

export type User = z.infer<typeof userSchema>

export type UserFormData = User & { confirmPassword: string }
