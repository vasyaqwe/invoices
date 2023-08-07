export const StatusBadge = ({ status }: { status: string }) => {
    const lookup: { [index: string]: any } = {
        Draft: "bg-draft-100 text-draft-400",
        Pending: "bg-pending-100 text-pending-400",
        Paid: "bg-paid-100 text-paid-400",
    }

    return (
        <p
            className={`${lookup[status]} py-2 px-7 rounded-md font-semibold w-fit status-badge`}
        >
            <span className="status-badge-text">{status}</span>
        </p>
    )
}
