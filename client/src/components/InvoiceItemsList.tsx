import { ReactComponent as Plus } from "@assets/plusNeutral.svg"
import { ReactComponent as Delete } from "@assets/delete.svg"
import { getTotalOfItem, inputClassName, labelClassName } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "./ui/Button"
import { ChangeEvent } from "react"
import { InvoiceItem } from "@/types"
import { ValidationErrors } from "@/hooks/useFormValidation"

type ItemListProps = {
    items: InvoiceItem[]
    errors: ValidationErrors
    onAddItem: () => void
    onDeleteItem: (id: string) => void
    onChange: (e: ChangeEvent<HTMLInputElement>, id: string) => void
}

export const InvoiceItemsList = ({
    items,
    errors,
    onChange,
    onAddItem,
    onDeleteItem,
}: ItemListProps) => {
    return (
        <>
            <legend className="text-2xl font-semibold text-primary-500">
                Item List
            </legend>
            {items.length > 0 && (
                <ul className="">
                    <AnimatePresence initial={false}>
                        {items.map((item, idx) => (
                            <motion.li
                                initial={{
                                    height: 0,
                                    opacity: 0,
                                    marginBottom: 0,
                                }}
                                animate={{
                                    height: "auto",
                                    opacity: 1,
                                    marginBottom: 8,
                                    transition: {
                                        type: "spring",
                                        bounce: 0.3,
                                        opacity: { delay: 0.025 * 4 },
                                    },
                                }}
                                exit={{
                                    height: 0,
                                    opacity: 0,
                                    marginBottom: 0,
                                }}
                                transition={{
                                    duration: 0.15 * 4,
                                    type: "spring",
                                    bounce: 0,
                                    opacity: { duration: 0.03 * 4 },
                                }}
                                className={`grid grid-rows-2 grid-cols-[20%_30%_1fr] gap-2 sm:gap-3
                            sm:grid-rows-1 sm:grid-cols-[1fr_10%_20%_20%]`}
                                key={item.id}
                            >
                                <div className="col-span-3 sm:col-span-1">
                                    <label
                                        className={`${labelClassName} ${
                                            errors["name" + idx]
                                                ? "text-danger-400"
                                                : "text-neutral-400"
                                        }`}
                                        htmlFor={"name" + idx}
                                    >
                                        Item Name
                                    </label>
                                    <input
                                        value={item.name}
                                        onChange={(e) => onChange(e, item.id)}
                                        className={`${inputClassName} 
                                        ${
                                            errors["name" + idx]
                                                ? "border-danger-400"
                                                : "focus-within:border-accent-400 border-primary-600 "
                                        } input`}
                                        name="name"
                                        id={"name" + idx}
                                        type="text"
                                    />
                                </div>
                                <div>
                                    <label
                                        className={`${labelClassName} ${
                                            errors["quantity" + idx]
                                                ? "text-danger-400"
                                                : "text-neutral-400"
                                        }`}
                                        htmlFor={"quantity" + idx}
                                    >
                                        Qty.
                                    </label>
                                    <input
                                        value={item.quantity}
                                        onChange={(e) => onChange(e, item.id)}
                                        className={`${inputClassName} 
                                        ${
                                            errors["quantity" + idx]
                                                ? "border-danger-400"
                                                : "focus-within:border-accent-400 border-primary-600 "
                                        } input`}
                                        name="quantity"
                                        id={"quantity" + idx}
                                        type="number"
                                    />
                                </div>
                                <div>
                                    <label
                                        className={`${labelClassName} ${
                                            errors["price" + idx]
                                                ? "text-danger-400"
                                                : "text-neutral-400"
                                        }`}
                                        htmlFor={"price" + idx}
                                    >
                                        Price
                                    </label>
                                    <input
                                        value={item.price}
                                        onChange={(e) => onChange(e, item.id)}
                                        className={`${inputClassName} 
                                        ${
                                            errors["price" + idx]
                                                ? "border-danger-400"
                                                : "focus-within:border-accent-400 border-primary-600 "
                                        } input`}
                                        name="price"
                                        id={"price" + idx}
                                        type="number"
                                    />
                                </div>
                                <div className="grid">
                                    <p className="text-neutral-400">Total</p>
                                    <div className="flex items-center justify-between">
                                        <p className="self-end font-semibold text-neutral-500">
                                            {getTotalOfItem(item)}
                                        </p>
                                        <button
                                            disabled={items.length === 1}
                                            className={`${
                                                items.length === 1
                                                    ? "opacity-40"
                                                    : "text-neutral-400"
                                            }`}
                                            onClick={() =>
                                                onDeleteItem(item.id)
                                            }
                                            type="button"
                                        >
                                            <Delete />
                                        </button>
                                    </div>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}
            <Button
                type="button"
                onClick={onAddItem}
                className="items-center justify-center w-full bg-primary-600"
            >
                <Plus />
                Add New Item
            </Button>
        </>
    )
}
