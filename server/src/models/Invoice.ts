import { Schema, model } from "mongoose"
import { customAlphabet } from "nanoid"

enum PaymentTerms {
    OneDay = "Net 1 day",
    SevenDays = "Net 7 days",
    FourteenDays = "Net 14 days",
    ThirtyDays = "Net 30 days",
}
interface Item {
    id: string
    name: string
    quantity: number
    price: number
}
enum Status {
    Paid = "Paid",
    Pending = "Pending",
    Draft = "Draft",
}

interface Invoice {
    id: string
    user: Schema.Types.ObjectId
    billFrom: {
        streetAddress: string
        city: string
        postCode: string
        country: string
    }
    billTo: {
        clientName: string
        clientEmail: string
        streetAddress: string
        city: string
        postCode: string
        country: string
    }
    status: Status
    date: Date
    description: string
    paymentTerms: PaymentTerms
    items: Item[]
}

const ItemSchema = new Schema<Item>({
    id: String,
    name: String,
    quantity: Number,
    price: Number,
})

const alphabet: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const generator = customAlphabet(alphabet, 6)
const today = Date.now()

const InvoiceSchema = new Schema<Invoice>({
    id: {
        type: String,
        default: () => generator(),
        unique: true,
        index: true,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    billFrom: {
        streetAddress: String,
        city: String,
        postCode: String,
        country: String,
    },
    billTo: {
        clientName: String,
        clientEmail: String,
        streetAddress: String,
        city: String,
        postCode: String,
        country: String,
    },
    status: String,
    date: {
        type: Date,
        default: new Date(today),
    },
    paymentTerms: String,
    description: String,
    items: [ItemSchema],
})

const Invoice = model<Invoice>("Invoice", InvoiceSchema)

export default Invoice
