import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isSameMonth,
    isToday,
    parse,
    startOfToday,
} from "date-fns"
import { classNames, formatDate } from "../../utils"
import { useState, FocusEvent } from "react"
import { ReactComponent as Chevron } from "../../assets/chevron.svg"
import { ReactComponent as CalendarIcon } from "../../assets/calendar.svg"

const colStartClasses = [
    "",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
]

type DatePickerProps = {
    selectedDay: Date
    onSelectedDayChange: (day: Date) => void
}

export const DatePicker = ({
    selectedDay,
    onSelectedDayChange,
}: DatePickerProps) => {
    const [open, setOpen] = useState(false)

    const today = startOfToday()

    const [hoveredDay, setHoveredDay] = useState<undefined | Date>(undefined)
    const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"))

    const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())

    const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    })

    const previousMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
    }

    const nextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
    }
    const onBlur = (e: FocusEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
    }
    return (
        <div
            tabIndex={0}
            onBlur={onBlur}
            className="bg-primary-800 rounded-md relative focus:outline-none border  border-primary-600 focus:border-accent-400"
        >
            <span
                className=" rounded-md min-h-[42px] py-2 px-3 cursor-pointer text-white
         w-full flex justify-between items-center"
                onClick={() => setOpen((open) => !open)}
            >
                <span>{formatDate(selectedDay)}</span>
                <CalendarIcon />
            </span>
            <div
                className={`absolute bottom-[110%] left-0 w-[calc(200%+1rem)] h-[382px] max-w-sm ${
                    open ? "block" : "hidden"
                } 
            text-white bg-primary-800 p-4 rounded-md border border-primary-600`}
            >
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg">
                        {format(firstDayCurrentMonth, "MMMM yyyy")}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="grid chevron-button place-items-center hover:bg-accent-400 w-8 h-8 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation()
                                previousMonth()
                            }}
                        >
                            <Chevron />
                        </button>
                        <button
                            type="button"
                            className="grid chevron-button  place-items-center hover:bg-accent-400 w-8 h-8 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation()
                                nextMonth()
                            }}
                        >
                            <Chevron className="rotate-180" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 mt-5 text-sm leading-6 text-center text-neutral-500">
                    <p>S</p>
                    <p>M</p>
                    <p>T</p>
                    <p>W</p>
                    <p>T</p>
                    <p>F</p>
                    <p>S</p>
                </div>
                <div className="grid grid-cols-7 mt-2 text-sm">
                    {days.map((day, dayIdx) => (
                        <div
                            key={day.toString()}
                            className={classNames(
                                dayIdx === 0
                                    ? colStartClasses[getDay(day)]
                                    : "",
                                "py-1.5"
                            )}
                        >
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onSelectedDayChange(day)
                                }}
                                onMouseOver={() => setHoveredDay(day)}
                                onMouseOut={() => setHoveredDay(undefined)}
                                className={classNames(
                                    isEqual(day, selectedDay)
                                        ? "text-white"
                                        : "",
                                    !isEqual(day, selectedDay) && isToday(day)
                                        ? "text-danger-400"
                                        : "",
                                    !isEqual(day, selectedDay) &&
                                        !isToday(day) &&
                                        isSameMonth(day, firstDayCurrentMonth)
                                        ? "text-white"
                                        : "",
                                    !isEqual(day, selectedDay) &&
                                        !isToday(day) &&
                                        !isSameMonth(day, firstDayCurrentMonth)
                                        ? "text-gray-400"
                                        : "",
                                    isEqual(day, selectedDay) && isToday(day)
                                        ? "bg-danger-400"
                                        : "",
                                    isEqual(day, selectedDay) && !isToday(day)
                                        ? "bg-accent-400"
                                        : "",
                                    !isEqual(day, selectedDay)
                                        ? "hover:bg-accent-400"
                                        : "",
                                    hoveredDay !== undefined &&
                                        isEqual(day, hoveredDay) &&
                                        isToday(day)
                                        ? "hover:bg-danger-400 hover:text-white"
                                        : "",
                                    isEqual(day, selectedDay) || isToday(day)
                                        ? "font-semibold"
                                        : "",
                                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                                )}
                            >
                                <time dateTime={format(day, "yyyy-MM-dd")}>
                                    {format(day, "d")}
                                </time>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
