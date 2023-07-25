import { Item } from "./types"

const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
    currency: "USD",
    style: "currency",
})

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
})

export const formatCurrency = (number: number): string => {
    return CURRENCY_FORMATTER.format(number)
}
export const formatDate = (date: Date): string => {
    return DATE_FORMATTER.format(date)
}
export const classNames = (...classes: string[]): string => {
    return classes.filter(Boolean).join(" ")
}

export const getTotalOfItem = (item: Item) => item.price * item.quantity

export const inputClassName = `border bg-primary-800 
    rounded-md py-2 px-3 text-white focus:outline-none`

export const labelClassName = `inline-block text-neutral-500`

export const emailPattern = "^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
