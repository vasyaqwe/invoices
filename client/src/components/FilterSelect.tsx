import { useEffect, useRef, useState } from "react"
import { ReactComponent as Chevron } from '../assets/chevron.svg'

export type SelectOption = string

type SearchParamsCallback = (prevParams: URLSearchParams) => URLSearchParams

type SelectProps = {
    options: SelectOption[]
    selectedOptions: SelectOption[]
    setSearchParams: (callback: SearchParamsCallback) => void
    filterKey: string
}

export const FilterSelect = ({ selectedOptions, setSearchParams, filterKey, options }: SelectProps) => {
    const [open, setOpen] = useState(false)
    const [highlightedIdx, setHighlightedIdx] = useState(0)

    const ref = useRef<HTMLDivElement>(null)

    function onChange(newFilter: string) {
        setSearchParams((prevParams: URLSearchParams) => {
            const lowerCasedNewFilter = newFilter.toLowerCase()
            const filter = prevParams.get(filterKey)
            const filters = filter?.split(',') || []
            if (!filter) {
                filters.push(lowerCasedNewFilter)
            } else if (filters.includes(lowerCasedNewFilter)) {
                const index = filters.indexOf(lowerCasedNewFilter)
                if (filters.length === 1) {
                    prevParams.delete(filterKey)
                    return prevParams
                }
                if (index !== -1) {
                    filters.splice(index, 1)
                }
            } else {
                filters.push(lowerCasedNewFilter)
            }
            prevParams.set(filterKey, filters.join(','))
            return prevParams
        })
    }

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != ref.current) return
            switch (e.code) {
                case "Enter":
                case "Space":
                    setOpen(true)
                    if (open) onChange(options[highlightedIdx])
                    break
                case "ArrowUp":
                case "ArrowDown": {
                    if (!open) {
                        setOpen(true)
                        break
                    }
                    const newValue = highlightedIdx + (e.code === 'ArrowDown' ? 1 : -1)
                    if (newValue >= 0 && newValue < options.length) {
                        e.preventDefault()
                        setHighlightedIdx(newValue)
                    }
                    break
                }
                case "Escape":
                    setOpen(false)
                    break
            }
        }

        ref.current?.addEventListener('keydown', handler)

        return () => ref.current?.removeEventListener('keydown', handler)
    }, [open, highlightedIdx, options])

    const optionSelected = (option: SelectOption) => (
        selectedOptions?.includes(option.toLowerCase())
    )

    return (
        <div tabIndex={0} className="cursor-pointer w-full flex items-center gap-2 justify-between border text-white border-primary-600
         focus:outline-none focus:border-accent-400 bg-primary-800 relative
    rounded-md py-2 px-3" aria-expanded={false} ref={ref}
            onClick={() => setOpen(open => !open)}
            onBlur={(e) => setOpen(false)}
        >
            Filter by {filterKey}
            <Chevron className={`${open ? 'rotate-90' : '-rotate-90'}`} />
            <ul className={`z-10 rounded-md absolute top-[110%] w-full left-0 border border-primary-600 bg-primary-800 ${open ? 'block' : 'hidden'} `}>
                {options.map((option, idx) => (
                    <li key={idx}
                        onMouseEnter={() => setHighlightedIdx(idx)}
                        onClick={(e) => {
                            e.stopPropagation()
                            onChange(option)
                        }}
                        className={`cursor-pointer flex items-center gap-2 hover:bg-accent-400 p-2
                        ${idx === highlightedIdx ? 'bg-accent-400 ' : ''}
                        `}>
                        <button aria-checked={optionSelected(option)} type="button"
                            data-state={optionSelected(option) ? 'checked' : 'unchecked'}
                            className="peer h-4 w-4 shrink-0 rounded-sm border border-white 
     focus-visible:outline-none 
        focus-visible:outline-accent-400 grid place-content-center
        disabled:cursor-not-allowed 
        disabled:opacity-50 data-[state=checked]:bg-accent-400 ">
                            {optionSelected(option) && <svg className={`w-[10px] h-[11px] pointer-events-none`}
                                version="1.1" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fillRule="evenodd">
                                    <g transform="translate(-9 -11)" fill="#fff" fillRule="nonzero">
                                        <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
                                    </g>
                                </g>
                            </svg>}
                        </button>
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    )
}