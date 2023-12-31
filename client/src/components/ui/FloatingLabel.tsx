import { ComponentProps, ReactNode } from "react"

type FloatingLabelProps = ComponentProps<"label"> & {
    text: string
    invalid?: string
    children: ReactNode
}

export const FloatingLabel = ({
    invalid,
    children,
    text,
    ...rest
}: FloatingLabelProps) => {
    const invalidStyle = invalid
        ? "text-danger-400"
        : "text-accent-400 peer-focus:text-accent-400 peer-placeholder-shown:text-neutral-500 "

    return (
        <div>
            <div className="relative">
                {children}
                <label
                    className={`pointer-events-none absolute rounded-md duration-300
                        transform -translate-y-4 scale-90 top-[.35rem] z-5 origin-[0] bg-primary-800 px-2 peer-focus:px-2 
                        peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
                        peer-focus:top-[.35rem] peer-focus:scale-90 peer-focus:-translate-y-4 left-[.4rem] ${invalidStyle}`}
                    {...rest}
                >
                    {text}
                </label>
            </div>
            {invalid && invalid !== "nomessage" && (
                <p className={`mt-1 text-danger-400`}>{invalid}</p>
            )}
        </div>
    )
}
