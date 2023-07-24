import { ChangeEvent, ReactNode } from "react"

export type userCredentials = {
    username: string
    password: string
}

export enum PaymentTerms {
    OneDay = 'Net 1 day',
    SevenDays = 'Net 7 days',
    FourteenDays = 'Net 14 days',
    ThirtyDays = 'Net 30 days',
}

export enum Status {
    Paid = 'Paid',
    Pending = 'Pending',
    Draft = 'Draft',
}

export interface Item {
    id: string
    name: string
    quantity: number
    price: number
}

export interface Invoice {
    id: string
    user: string
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
    items: Item[]
}

export interface InvoiceFormData {
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
    items: Item[]
    [key: string]: any
}

export type ItemListProps = {
    items: Item[]
    errors: string[],
    onAddItem: () => void
    onDeleteItem: (id: string) => void
    draft: boolean
    onChange: (e: ChangeEvent<HTMLInputElement>, id: string) => void
}

export type InputProps = {
    id: string
    type: string
    placeholder?: string
    name: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    value: string | number
    pattern?: string
    invalid?: boolean
}

export type FloatingLabelProps = {
    invalid?: boolean
    htmlFor: string
    children: ReactNode
    text: string
}
export interface ToastPayload {
    text: string,
    error?: boolean,
    alert?: boolean
}
export interface Toast extends ToastPayload {
    open: boolean
    text: string,
    error?: boolean,
    alert?: boolean
}