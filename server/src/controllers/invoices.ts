import Invoice from "../models/Invoice"
import { Request, Response } from "express"
import jwt, { Secret } from "jsonwebtoken"
import { DecodedToken } from "../interfaces"

const LIMIT = 2

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as Secret

export const getInvoices = async (req: Request, res: Response) => {
    const decoded = jwt.verify(req.cookies.jwt, refreshTokenSecret)

    const { userId } = decoded as DecodedToken

    const page = req.query.page || 1

    const skipCount = (+page - 1) * LIMIT

    const invoices = await Invoice.find({ user: userId })
        .skip(skipCount)
        .limit(LIMIT)
        .exec()

    // Getting the numbers of products stored in database
    const count = await Invoice.countDocuments()

    res.json({
        invoices,
        totalPages: Math.ceil(count / LIMIT),
        currentPage: page,
    })
}

export const getInvoice = async (req: Request, res: Response) => {
    const { id } = req.params
    const invoice = await Invoice.findOne({ id })

    if (!invoice) {
        res.status(400).json({ message: "No invoice found!" })
        return
    }

    res.json(invoice)
}

export const createInvoice = async (req: Request, res: Response) => {
    const invoice = await Invoice.create({ ...req.body })

    if (invoice) {
        res.status(201).json({ message: `New invoice ${invoice.id} created` })
    } else {
        res.status(400).json({ message: `Invalid invoice data received!` })
    }
}

export const createInvoiceDraft = async (req: Request, res: Response) => {
    const invoice = await Invoice.create({ ...req.body })

    if (invoice) {
        res.status(201).json({ message: `New invoice ${invoice.id} created` })
    } else {
        res.status(400).json({ message: `Invalid invoice data received!` })
    }
}

export const updateInvoice = async (req: Request, res: Response) => {
    const invoice = await Invoice.findOneAndUpdate(
        { id: req.params.id },
        { ...req.body }
    )

    if (!invoice) {
        res.status(400).json({ message: "Invoice not found" })
        return
    }

    res.json({ message: `Updated invoice: ${invoice.id}` })
}

export const deleteInvoice = async (req: Request, res: Response) => {
    const { id } = req.params

    const invoice = await Invoice.findById(id)

    if (!invoice) {
        res.status(400).json({ message: "No invoice found!" })
        return
    }

    const deleted = await Invoice.findOneAndDelete({ id })

    res.json({ message: `Invoice ${deleted!.id} was deleted!` })
}
