import * as z from "zod"

export const statusSchema = z.enum(["Paid", "Pending", "Draft"])

export const paymentTermsSchema = z.enum([
    "Net 1 day",
    "Net 7 days",
    "Net 14 days",
    "Net 30 days",
])

export const invoiceItemSchema = z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    quantity: z.number().min(1),
    price: z.number().min(1),
})

export const invoiceSchema = z.object({
    billFrom: z.object({
        streetAddress: z.string().nonempty(),
        city: z.string().nonempty(),
        postCode: z.string().nonempty(),
        country: z.string().nonempty(),
    }),
    billTo: z.object({
        clientName: z.string().nonempty(),
        clientEmail: z.string().email(),
        streetAddress: z.string().nonempty(),
        city: z.string().nonempty(),
        postCode: z.string().nonempty(),
        country: z.string().nonempty(),
    }),
    date: z.date(),
    description: z.string().nonempty(),
    status: statusSchema,
    paymentTerms: paymentTermsSchema,
    items: z.array(invoiceItemSchema).nonempty(),
})
