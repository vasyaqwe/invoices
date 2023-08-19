import Invoice from "../models/Invoice"
import { Request, Response } from "express"

const LIMIT = 10

export const getInvoices = async (req: Request, res: Response) => {
    const page = req.query.page || 1

    const skipCount = (+page - 1) * LIMIT

    const invoices = await Invoice.find({ user: req.user })
        .sort({ createdAt: -1, _id: -1 })
        .skip(skipCount)
        .limit(LIMIT)
        .exec()

    const count = await Invoice.countDocuments()

    const result = {
        invoices,
        totalPages: Math.ceil(count / LIMIT),
        currentPage: page,
    }

    res.json(result)
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
    const invoice = await Invoice.create({ ...req.body, user: req.user })

    if (invoice) {
        res.status(201).json({ message: `New invoice ${invoice.id} created` })
    } else {
        res.status(400).json({ message: `Invalid invoice data received!` })
    }
}

export const createInvoiceDraft = async (req: Request, res: Response) => {
    const invoice = await Invoice.create({ ...req.body, user: req.user })

    if (invoice) {
        res.status(201).json({ message: `New invoice ${invoice.id} created` })
    } else {
        res.status(400).json({ message: `Invalid invoice data received!` })
    }
}

export const updateInvoice = async (req: Request, res: Response) => {
    const invoice = await Invoice.findOneAndUpdate(
        { id: req.params.id },
        { ...req.body, user: req.user }
    )

    if (!invoice) {
        res.status(400).json({ message: "Invoice not found" })
        return
    }

    res.json({ message: `Updated invoice: ${invoice.id}` })
}

export const deleteInvoice = async (req: Request, res: Response) => {
    const { id } = req.params

    const invoice = await Invoice.findOne({ id })

    if (!invoice) {
        res.status(400).json({ message: "No invoice found!" })
        return
    }

    const deleted = await Invoice.findOneAndDelete({ id })

    res.json({ message: `Invoice ${deleted!.id} was deleted!` })
}
