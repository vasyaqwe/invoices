import { useParams, Link, Navigate } from "react-router-dom"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { useQuery } from "react-query"
import { getInvoice } from "@/api/invoices"
import { formatCurrency, formatDate, pageSpinnerClassName } from "@/utils"
import { ReactComponent as Chevron } from "@/assets/chevron.svg"
import { useStore } from "@/stores/useStore"
import { Spinner } from "@/components/ui/Spinner"
import { useErrorToast } from "@/hooks/useErrorToast"
import { Button } from "@/components/ui/Button"
import { InvoiceItem } from "@/types"
import { ConfirmDeletionModal } from "@/components/modals/ConfirmDeletionModal"
import { EditInvoiceModal } from "@/components/modals/EditInvoiceModal"

export const Invoice = () => {
    const { openModal } = useStore()
    const { id } = useParams()

    const { isLoading, error, data } = useQuery(
        ["invoices", id],
        () => getInvoice(id!),
        { retry: false }
    )

    useErrorToast(error)

    if (error && error instanceof Error) return <Navigate to={".."} />
    if (isLoading) return <Spinner className={pageSpinnerClassName} />

    const invoice = data!

    const allItemsTotal = invoice?.items.reduce(
        (a: number, b: InvoiceItem) => a + b.price * b.quantity,
        0
    )

    const itemsTotal = (item: InvoiceItem) => {
        return item.price * item.quantity
    }

    const date = new Date(invoice.date)
    const paymentTermsDate = new Date(invoice.date)
    const paymentTerms = new Date(
        paymentTermsDate.setDate(
            date.getDate() + +invoice.paymentTerms.match(/\d+/)![0]
        )
    )

    return (
        <>
            <ConfirmDeletionModal invoice={invoice} />

            <EditInvoiceModal invoice={invoice} />

            <Link
                className="flex items-center gap-3"
                to="/"
            >
                <Chevron /> Back
            </Link>
            <div className="bg-primary-800 rounded-md flex items-center p-6 justify-between mt-8">
                <div className="flex items-center justify-between flex-1 sm:justify-start">
                    <p className="mr-4">Status</p>
                    <StatusBadge status={invoice.status} />
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <Button
                        onClick={() => openModal("editInvoice")}
                        variant="neutral"
                    >
                        Edit
                    </Button>

                    <Button
                        variant="danger"
                        onClick={() => openModal("confirmDeletion")}
                    >
                        Delete
                    </Button>
                </div>
            </div>
            <section className="mt-4 bg-primary-800 rounded-md p-6 text-neutral-400 font-thin grid gap-12 mb-32">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <p className="font-semibold text-xl">
                            <span className="text-neutral-500">#</span>
                            {id?.toUpperCase()}
                        </p>
                        <p className="leading-3">{invoice.description}</p>
                    </div>
                    <address className="text-right leading-5">
                        <p>{invoice.billFrom.streetAddress}</p>
                        <p>{invoice.billFrom.city}</p>
                        <p>{invoice.billFrom.postCode}</p>
                        <p>{invoice.billFrom.country}</p>
                    </address>
                </div>
                <div className="flex justify-between items-start flex-wrap gap-12 max-w-[90%]">
                    <div>
                        <p>Invoice Date</p>
                        <p className="text-xl text-white">
                            <b>{formatDate(date)}</b>
                        </p>
                        <p className="mt-7">Payment Due</p>
                        <p className="text-xl text-white">
                            <b>{formatDate(paymentTerms)}</b>
                        </p>
                    </div>
                    <div>
                        <p>Bill To</p>
                        <p className="text-xl text-white">
                            <b>{invoice.billTo.clientName}</b>
                        </p>
                        <address className="leading-5">
                            <p>{invoice.billTo.streetAddress}</p>
                            <p>{invoice.billTo.city}</p>
                            <p>{invoice.billTo.postCode}</p>
                            <p>{invoice.billTo.country}</p>
                        </address>
                    </div>
                    <div>
                        <p>Sent to</p>
                        <p className="text-xl text-white">
                            <b>{invoice.billTo.clientEmail}</b>
                        </p>
                    </div>
                </div>
                <table className="bg-primary-600 rounded-md overflow-hidden">
                    <thead>
                        <tr>
                            <th className="text-left pt-7 px-7 hidden sm:table-cell">
                                Item Name
                            </th>
                            <th className="text-center pt-7 px-7 hidden sm:table-cell">
                                QTY.
                            </th>
                            <th className="text-left pt-7 px-7 hidden sm:table-cell">
                                Price
                            </th>
                            <th className="text-right pt-7 px-7 hidden sm:table-cell">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item: InvoiceItem) => (
                            <tr
                                key={item.id}
                                className="font-semibold text-white"
                            >
                                <td className="sm:text-left py-5 px-7 sm:p-7 block sm:table-cell">
                                    <span className="text-neutral-400 font-thin sm:hidden">
                                        Item Name:{" "}
                                    </span>
                                    {item.name}
                                </td>
                                <td className="sm:text-center py-5 px-7 sm:p-7 block sm:table-cell">
                                    <span className="text-neutral-400 font-thin sm:hidden">
                                        QTY.:{" "}
                                    </span>
                                    {item.quantity}
                                </td>
                                <td className="sm:text-left py-5 px-7 sm:p-7 block sm:table-cell">
                                    <span className="text-neutral-400 font-thin sm:hidden">
                                        Price:{" "}
                                    </span>
                                    {formatCurrency(item.price)}
                                </td>
                                <td className="sm:text-right py-5 px-7 sm:p-7 block sm:table-cell">
                                    <span className="text-neutral-400 font-thin sm:hidden">
                                        Total:{" "}
                                    </span>
                                    {formatCurrency(itemsTotal(item))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-black">
                        <tr className="font-semibold text-white">
                            <td className="sm:text-left py-5 px-7 sm:p-7 ">
                                Amount Due
                                <span className="sm:text-right py-5 px-7 sm:p-7 text-2xl sm:text-3xl sm:hidden">
                                    {formatCurrency(allItemsTotal)}{" "}
                                </span>
                            </td>
                            <td className="sm:text-left py-5 px-7 sm:p-7 hidden sm:table-cell"></td>
                            <td className="sm:text-left py-5 px-7 sm:p-7 hidden sm:table-cell"></td>
                            <td className="sm:text-right py-5 px-7 sm:p-7 text-2xl sm:text-3xl hidden sm:block">
                                {formatCurrency(allItemsTotal)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </section>
            <div className="bg-primary-800 p-6 flex items-center justify-end gap-3 fixed bottom-0 left-0 w-full sm:hidden">
                <Button
                    onClick={() => openModal("editInvoice")}
                    className="bg-neutral-700"
                >
                    Edit
                </Button>

                <Button
                    className="bg-danger-400"
                    onClick={() => openModal("confirmDeletion")}
                >
                    Delete
                </Button>
            </div>
        </>
    )
}
