import { useInfiniteQuery } from "react-query"
import { useStore } from "../stores/useStore"
import { getInvoices } from "../api/invoices"
import { InvoiceItem } from "../components/InvoiceItem"
import { ReactComponent as Plus } from "../assets/plus.svg"
import { useEffect, useRef } from "react"
import { Spinner } from "../components/ui/Spinner"
import { FilterSelect } from "../components/ui/FilterSelect"
import { useSearchParams } from "react-router-dom"
import { ErrorMessage } from "../components/ui/ErrorMessage"
import { Button } from "../components/ui/Button"
import { useIntersection } from "@mantine/hooks"
import { pageSpinnerClassName } from "../utils"

export const Dashboard = () => {
    const { openModal } = useStore()

    const [searchParams, setSearchParams] = useSearchParams()

    const statusFilter = searchParams.get("status")?.split(",") ?? []

    const lastInvoiceRef = useRef<HTMLLIElement>(null)

    const { ref, entry } = useIntersection({
        root: lastInvoiceRef.current,
        threshold: 1,
    })

    const {
        isLoading,
        error,
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteQuery(
        ["invoices"],
        ({ pageParam = 1 }) => getInvoices(pageParam),
        {
            getNextPageParam: (res, pages) => {
                if (pages.length < res.totalPages) {
                    return pages.length + 1
                } else {
                    return undefined
                }
            },
            retry: false,
            refetchInterval: 5000,
        }
    )

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage) fetchNextPage()
    }, [entry, hasNextPage])

    const invoices = data?.pages.flatMap((page) => page.invoices)

    const filteredInvoices =
        statusFilter.length > 0
            ? invoices
                  ?.filter((invoice) =>
                      statusFilter.includes(invoice.status.toLowerCase())
                  )
                  .flat()
            : invoices

    return (
        <>
            {error ? (
                <ErrorMessage
                    message={
                        error && error instanceof Error
                            ? error.message
                            : "Unknown error occured"
                    }
                />
            ) : (
                <div className="pb-16">
                    <div className="flex items-start justify-between gap-5">
                        <div>
                            <h1 className="text-4xl font-semibold">Invoices</h1>
                            <p className="text-neutral-400">
                                There are {filteredInvoices?.length} total
                                invoices.
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
                    <ul className="mt-8 md:mt-12 pb-8 grid gap-3">
                        {isLoading ? (
                            <Spinner className={pageSpinnerClassName} />
                        ) : (
                            filteredInvoices?.map((invoice, idx) => {
                                if (filteredInvoices.length === idx + 1) {
                                    return (
                                        <li
                                            key={invoice.id}
                                            ref={ref}
                                        >
                                            <InvoiceItem {...invoice} />
                                        </li>
                                    )
                                }
                                return (
                                    <li key={invoice.id}>
                                        <InvoiceItem {...invoice} />
                                    </li>
                                )
                            })
                        )}
                    </ul>
                    {isFetchingNextPage && (
                        <Spinner className="absolute left-1/2 -translate-x-1/2 w-[30px] h-[30px]" />
                    )}
                </div>
            )}
        </>
    )
}
