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
import { validateInvoice, isLoggedIn } from "../middleware"

router.use(isLoggedIn)

router.route("/").get(getInvoices).post(validateInvoice, createInvoice)

router.route("/draft").post(createInvoiceDraft)

router
    .route("/:id")
    .get(getInvoice)
    .patch(validateInvoice, updateInvoice)
    .delete(deleteInvoice)

export default router
