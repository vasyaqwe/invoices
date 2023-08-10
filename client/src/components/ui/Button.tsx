import { ComponentProps } from "react"
import { Spinner } from "./Spinner"

type ButtonProps = ComponentProps<"button"> & {
    isLoading?: boolean
    variant?: "default" | "outline" | "danger" | "neutral" | "faded"
}

export const Button = ({
    className,
    children,
    variant = "default",
    isLoading = false,
    ...rest
}: ButtonProps) => {
    const variantLookup: { [key: string]: string } = {
        default: "bg-accent-700 focus-visible:outline-white",
        outline: "border border-accent-400 focus-visible:outline-white",
        danger: "bg-danger-400",
        neutral: "bg-neutral-700",
        faded: "bg-primary-600",
    }

    return (
        <button
            {...rest}
            className={`py-2 rounded-full focus:outline-none  text-white px-6 font-semibold hover:opacity-75 
            ${variantLookup[variant]}
            ${
                isLoading ? "opacity-80 cursor-default" : ""
            } flex items-center gap-2
            text-sm sm:text-base
            ${className}`}
        >
            {isLoading && <Spinner />}
            {children}
        </button>
    )
}
