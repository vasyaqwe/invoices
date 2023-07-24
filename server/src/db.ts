import mongoose, { ConnectOptions } from 'mongoose'

const connectDB = async () => {
    try {
        const dbUrl = 'mongodb://127.0.0.1:27017/invoices'
        const con = await mongoose.connect(dbUrl,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            } as ConnectOptions)
        console.log(`Database connected : ${con.connection.host}`)
    } catch (error: any) {
        console.error(`Error: ${error.message}`)
    }
}

export default connectDB