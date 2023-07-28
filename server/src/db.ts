import mongoose, { ConnectOptions } from "mongoose"
import Invoice from "./models/Invoice"

const connectDB = async () => {
    try {
        const dbUrl = process.env.MONGO_URL!
        const con = await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
        console.log(`Database connected : ${con.connection.host}`)
        Invoice.insertMany([
            {
                user: "64bf7f57221fb290487f9432",
                billFrom: {
                    streetAddress: "321",
                    city: "321",
                    postCode: "321",
                    country: "321",
                },
                billTo: {
                    clientName: "321",
                    clientEmail: "321",
                    streetAddress: "321",
                    city: "321",
                    postCode: "321",
                    country: "321",
                },
                status: "Paid",
                paymentTerms: "Net 1 day",
                description: "hello2",
            },
        ])
    } catch (error: any) {
        console.error(`Error: ${error.message}`)
    }
}

export default connectDB
