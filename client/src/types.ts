export type PaginatedInvoiceReturn = Promise<{
    totalPages: number
    page: number
    invoices: Invoice[]
}>

export type InvoiceReturn = Promise<Invoice>

export type Invoice = {
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
} & Record<string, any>

export enum PaymentTerms {
    OneDay = "Net 1 day",
    SevenDays = "Net 7 days",
    FourteenDays = "Net 14 days",
    ThirtyDays = "Net 30 days",
}

export enum Status {
    Paid = "Paid",
    Pending = "Pending",
    Draft = "Draft",
}

export type InvoiceItem = {
    id: string
    name: string
    quantity: number
    price: number
}

export type User = {
    username: string
    password: string
}
export type UserFormData = User & { confirmPassword: string }
