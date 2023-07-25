import { InputProps } from "../types"

export const Input = ({
    invalid = false,
    id,
    pattern = "",
    type,
    placeholder = " ",
    name,
    onChange,
    value,
    required = false,
}: InputProps) => {
    const invalidStyle = invalid
        ? "border-danger-400"
        : "border-primary-600 focus-within:border-accent-400 "

    return (
        <input
            pattern={pattern !== "" ? pattern : undefined}
            id={id}
            type={type}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            className={`input block border  bg-primary-800 
                        rounded-md py-3 px-3 text-white
                        focus:outline-none peer ${invalidStyle}`}
            placeholder={placeholder}
        />
    )
}
