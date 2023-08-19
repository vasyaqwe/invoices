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
        streetAddress: z.string(),
        city: z.string(),
        postCode: z.string(),
        country: z.string(),
    }),
    billTo: z.object({
        clientName: z.string(),
        clientEmail: z.string().email(),
        streetAddress: z.string(),
        city: z.string(),
        postCode: z.string(),
        country: z.string(),
    }),
    date: z.string(),
    description: z.string(),
    status: statusSchema,
    paymentTerms: paymentTermsSchema,
    items: z.array(invoiceItemSchema).nonempty(),
})
