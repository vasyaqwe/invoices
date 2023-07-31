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
import asyncHandler from "express-async-handler"
import { validateInvoice, isLoggedIn } from "../middleware"

router.use(isLoggedIn)

router
    .route("/")
    .get(getInvoices)
    .post(validateInvoice, asyncHandler(createInvoice))

router.route("/draft").post(asyncHandler(createInvoiceDraft))

router
    .route("/:id")
    .get(asyncHandler(getInvoice))
    .patch(validateInvoice, asyncHandler(updateInvoice))
    .delete(asyncHandler(deleteInvoice))

export default router
