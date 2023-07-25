import { Link } from "react-router-dom"
import { Invoice, Item } from "../types"
import { StatusBadge } from "./StatusBadge"
import { ReactComponent as Chevron } from "../assets/chevron.svg"
import { formatCurrency, formatDate } from "../utils"


export const InvoiceItem = ({ id, paymentTerms, date, billTo, items, status, billFrom }: Invoice) => {
    const invoiceDate = new Date(date)

    const paymentTermsDate = new Date(invoiceDate.setDate(invoiceDate.getDate() + +paymentTerms.match(/\d+/)![0]))
    const itemsTotal = items.reduce((a: number, b: Item) => a + b.price, 0)

    return (
        <li>
            <Link className="bg-primary-800 rounded-md flex text-sm sm:text-base flex-col py-6 px-7 gap-6 sm:grid 
            sm:grid-cols-[100px,160px,1fr,1fr,130px,20px] border border-transparent hover:border-accent-700
             sm:items-center sm:gap-0" to={`/invoices/${id}`}>
                <span className="flex justify-between items-center flex-1 sm:flex-initial">
                    <span className="font-semibold"><span className="text-neutral-500">#</span>{id.toUpperCase()}</span>
                    <span className="sm:hidden">{billTo.clientName}</span>
                </span>
                <span className="hidden sm:flex justify-between items-center flex-1 sm:flex-initial">
                    Due to {formatDate(paymentTermsDate)}
                </span>
                <span className="hidden sm:flex justify-between items-center flex-1 sm:flex-initial">
                    {billTo.clientName}
                </span>
                <span className="flex justify-between items-center">
                    <span className="flex flex-col justify-between">
                        <span className="sm:hidden">Due to {formatDate(paymentTermsDate)}</span>
                        <span className="font-semibold text-2xl">
                            {formatCurrency(itemsTotal)}</span>
                    </span>
                    <span className="sm:hidden"><StatusBadge status={status} /></span>
                </span>
                <span className="hidden sm:block"><StatusBadge status={status} /></span>
                <Chevron className="hidden sm:block rotate-180 justify-self-end" />
            </Link>
        </li>
    )
}
