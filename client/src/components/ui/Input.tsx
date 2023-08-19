import { ComponentProps } from "react"

type InputProps = ComponentProps<"input"> & { invalid?: string }

export const Input = ({ invalid, ...rest }: InputProps) => {
    const invalidStyle = !!invalid
        ? "border-danger-400"
        : "border-primary-600 focus-within:border-accent-400 "

    return (
        <>
            <input
                placeholder=" "
                className={`input block border  bg-primary-800 
                        rounded-md py-3 px-3 text-white
                        focus:outline-none peer ${invalidStyle}`}
                {...rest}
            />
        </>
    )
}
