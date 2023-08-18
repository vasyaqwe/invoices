import * as z from "zod"

export const statusSchema = z.enum(["Paid", "Pending", "Draft"])

export const paymentTermsSchema = z.enum([
    "Net 1 day",
    "Net 7 days",
    "Net 14 days",
    "Net 30 days",
])

export const invoiceItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
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
    date: z.date(),
    description: z.string(),
    status: statusSchema,
    paymentTerms: paymentTermsSchema,
    items: z.array(invoiceItemSchema).nonempty(),
})
