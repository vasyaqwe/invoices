import { zParse } from "./../middleware"
import express from "express"
const router = express.Router({ mergeParams: true })
import {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    createInvoiceDraft,
} from "../controllers/invoices"
import { isLoggedIn } from "../middleware"
import { invoiceSchema } from "../lib/validations/invoice"

router.use(isLoggedIn)

router.route("/").get(getInvoices).post(zParse(invoiceSchema), createInvoice)

router.route("/draft").post(createInvoiceDraft)

router
    .route("/:id")
    .get(getInvoice)
    .patch(zParse(invoiceSchema), updateInvoice)
    .delete(deleteInvoice)

export default router
