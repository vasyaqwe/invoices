import { Schema, Types, model } from "mongoose"
import { customAlphabet } from "nanoid"
import { Invoice as RawInvoice, InvoiceItem } from "../../../common/types"

const ItemSchema = new Schema<InvoiceItem>({
    id: String,
    name: String,
    quantity: Number,
    price: Number,
})

const alphabet: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const generator = customAlphabet(alphabet, 6)
const today = Date.now()

type Invoice = RawInvoice & { user: Types.ObjectId }

const InvoiceSchema = new Schema<Invoice>(
    {
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
    },
    { timestamps: true }
)

const Invoice = model<Invoice>("Invoice", InvoiceSchema)

export default Invoice
