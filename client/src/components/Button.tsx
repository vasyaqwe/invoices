import { ComponentProps } from "react"
import { Spinner } from "./Spinner"

type ButtonProps = ComponentProps<"button"> & { isLoading?: boolean }

export const Button = ({
    className,
    children,
    isLoading = false,
    ...rest
}: ButtonProps) => {
    return (
        <button
            {...rest}
            className={` py-3 rounded-full text-white px-6 font-semibold hover:opacity-60 
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
