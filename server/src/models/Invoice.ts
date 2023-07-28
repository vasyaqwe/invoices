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
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
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
        streetAddress: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        postCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    billTo: {
        clientName: {
            type: String,
            required: true,
        },
        clientEmail: {
            type: String,
            required: true,
        },
        streetAddress: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        postCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: new Date(today),
    },
    paymentTerms: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    items: {
        type: [ItemSchema],
        validate: {
            validator: function (items: Item[]) {
                return items && items.length > 0
            },
            message: "At least one item must be provided.",
        },
        required: true,
    },
})

const Invoice = model<Invoice>("Invoice", InvoiceSchema)

export default Invoice
