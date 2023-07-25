export const Spinner = ({ className = "" }) => {
    return (
        <span
            className={`spinner w-[20px] h-[20px] min-w-[20px] 
            inline-block rounded-full border-b-transparent border-2
             border-neutral-100 
            ${className}`}
        ></span>
    )
}
