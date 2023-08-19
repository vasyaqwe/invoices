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
    id: z.string().optional(),
    billFrom: z.object({
        streetAddress: z.string().nonempty({ message: "Required" }),
        city: z.string().nonempty({ message: "Required" }),
        postCode: z.string().nonempty({ message: "Required" }),
        country: z.string().nonempty({ message: "Required" }),
    }),
    billTo: z.object({
        clientName: z.string().nonempty({ message: "Required" }),
        clientEmail: z.string().email(),
        streetAddress: z.string().nonempty({ message: "Required" }),
        city: z.string().nonempty({ message: "Required" }),
        postCode: z.string().nonempty({ message: "Required" }),
        country: z.string().nonempty({ message: "Required" }),
    }),
    date: z.date(),
    description: z.string().nonempty({ message: "Required" }),
    status: statusSchema,
    paymentTerms: paymentTermsSchema,
    items: z.array(invoiceItemSchema),
})
