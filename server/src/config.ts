const allowedOrigins = [
    "https://invoices-ga5s.onrender.com"
]

export const corsOptions = {
    origin: (origin: string, callback: (arg0: null | Error, arg2?: boolean) => void) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}