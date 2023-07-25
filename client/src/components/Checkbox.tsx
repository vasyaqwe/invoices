export const Checkbox = ({
    onChange,
    checked,
    label,
    id,
    disabled = false,
}: {
    onChange: (value: boolean) => void
    checked: boolean
    label: string
    id: string
    disabled?: boolean
    labelClassName?: string
}) => {
    return (
        <div className='flex flex-wrap items-center gap-2'>
            <button
                disabled={disabled}
                aria-checked={checked}
                type='button'
                id={id}
                onClick={() => onChange(!checked)}
                data-state={checked ? 'checked' : 'unchecked'}
                className='peer h-4 w-4 shrink-0 rounded-sm border border-white 
     focus-visible:outline-none 
        focus-visible:outline-accent-400 grid place-content-center
        disabled:cursor-not-allowed 
        disabled:opacity-50 data-[state=checked]:bg-accent-400 '
            >
                {checked && (
                    <svg
                        className={`w-[10px] h-[11px] pointer-events-none`}
                        version='1.1'
                        viewBox='0 0 17 12'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <g
                            fill='none'
                            fillRule='evenodd'
                        >
                            <g
                                transform='translate(-9 -11)'
                                fill='#fff'
                                fillRule='nonzero'
                            >
                                <path d='m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z' />
                            </g>
                        </g>
                    </svg>
                )}
            </button>
            <label
                className={'-mb-1'}
                htmlFor={id}
            >
                {label}
            </label>
        </div>
    )
}
