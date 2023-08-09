import { Link } from "react-router-dom"
import { StatusBadge } from "./ui/StatusBadge"
import { ReactComponent as Chevron } from "../assets/chevron.svg"
import { formatCurrency, formatDate } from "../utils"
import { Invoice, InvoiceItem as InvoiceItemType } from "../types"

export const InvoiceItem = ({
    id,
    paymentTerms,
    date,
    billTo,
    items,
    status,
}: Invoice) => {
    const invoiceDate = new Date(date)

    const paymentTermsDate = new Date(
        invoiceDate.setDate(
            invoiceDate.getDate() + +paymentTerms.match(/\d+/)![0]
        )
    )
    const itemsTotal = items.reduce(
        (a: number, b: InvoiceItemType) => a + b.price * b.quantity,
        0
    )

    return (
        <>
            <Link
                className="bg-primary-800 rounded-md flex text-base flex-col py-6 px-7 gap-6 sm:grid 
            sm:grid-cols-[100px,160px,1fr,1fr,130px,20px] border border-transparent hover:border-accent-700 
            focus:outline-none focus:border-accent-700
             sm:items-center sm:gap-0"
                to={`/invoices/${id}`}
            >
                <span className="flex items-center justify-between flex-1 sm:flex-initial">
                    <span className="font-semibold">
                        <span className="text-neutral-500">#</span>
                        {id.toUpperCase()}
                    </span>
                    <span className="sm:hidden">{billTo.clientName}</span>
                </span>
                <span className="items-center justify-between flex-1 hidden sm:flex sm:flex-initial">
                    Due to {formatDate(paymentTermsDate)}
                </span>
                <span className="items-center justify-between flex-1 hidden sm:flex sm:flex-initial">
                    {billTo.clientName}
                </span>
                <span className="flex items-center justify-between">
                    <span className="flex flex-col justify-between">
                        <span className="sm:hidden">
                            Due to {formatDate(paymentTermsDate)}
                        </span>
                        <span className="text-2xl font-semibold">
                            {formatCurrency(itemsTotal)}
                        </span>
                    </span>
                    <span className="sm:hidden">
                        <StatusBadge status={status} />
                    </span>
                </span>
                <span className="hidden sm:block">
                    <StatusBadge status={status} />
                </span>
                <Chevron className="hidden rotate-180 sm:block justify-self-end" />
            </Link>
        </>
    )
}
