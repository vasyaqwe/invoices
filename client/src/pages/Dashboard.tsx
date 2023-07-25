import { useQuery } from "react-query"
import { useStore } from "../stores/useStore"
import { getInvoices } from "../api/invoices"
import { Invoice } from "../types"
import { InvoiceItem } from "../components/InvoiceItem"
import { ReactComponent as Plus } from "../assets/plus.svg"
import { useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Spinner } from "../components/Spinner"
import { FilterSelect } from "../components/FilterSelect"
import { useSearchParams } from "react-router-dom"
import { ErrorMessage } from "../components/ErrorMessage"
import { Button } from "../components/Button"

export const Dashboard = () => {
    const { openModal, modals } = useStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const statusFilter = searchParams.get("status")?.split(",") ?? []

    const currentUser = useAuth()

    const {
        isLoading,
        error,
        data: invoices,
    } = useQuery(["invoices"], getInvoices, {
        refetchInterval: 150000,
    })

    useEffect(() => {
        if (Object.values(modals).some((v) => v)) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }, [modals])

    const filteredInvoices =
        statusFilter.length > 0
            ? invoices?.filter((invoice) =>
                  statusFilter.includes(invoice.status.toLowerCase())
              ) ?? invoices
            : invoices

    return (
        <>
            {error ? (
                <ErrorMessage
                    message={
                        error && error instanceof Error
                            ? `There was an error loading invoices. Reason: ${error.message}`
                            : ""
                    }
                />
            ) : (
                <>
                    <div className="flex items-start justify-between gap-5">
                        <div>
                            <h1 className="text-4xl font-semibold">Invoices</h1>
                            <p className="text-neutral-400">
                                There are{" "}
                                {invoices
                                    ? invoices.filter(
                                          (i) => i.user === currentUser!.userId
                                      ).length
                                    : ""}{" "}
                                total invoices.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                            <FilterSelect
                                filterKey="status"
                                setSearchParams={setSearchParams}
                                options={["Paid", "Pending", "Draft"]}
                                selectedOptions={statusFilter}
                            />
                            <Button
                                onClick={() => openModal("createInvoice")}
                                className="pb-2 pt-2 pr-3 pl-2 bg-accent-700 "
                            >
                                <span className="bg-white p-3 min-w-[35px] rounded-full inline-block">
                                    <Plus />
                                </span>
                                New
                                <span className="hidden sm:inline">
                                    Invoice
                                </span>
                            </Button>
                        </div>
                    </div>
                    <ul className="mt-8 md:mt-12 grid gap-3">
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            filteredInvoices?.map((invoice: Invoice) => (
                                <InvoiceItem
                                    key={invoice.id}
                                    {...invoice}
                                />
                            ))
                        )}
                    </ul>
                </>
            )}
        </>
    )
}
