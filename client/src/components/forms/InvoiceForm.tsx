import { RefObject } from "react"
import { FloatingLabel } from "../ui/FloatingLabel"
import { emailPattern, labelClassName } from "@/utils"
import { DatePicker } from "../ui/DatePicker"
import { Select } from "../ui/Select"
import { InvoiceItemsList } from "../InvoiceItemsList"
import { Invoice } from "@/types"
import { Input } from "../ui/Input"
import { ValidationErrors } from "@/hooks/useFormValidation"

export type OnChangeEvent = React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement
>

type InvoiceFormProps = {
    formData: Invoice
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    errors: ValidationErrors
    onSelectedDayChange: (day: Date) => void
    onSelectChange: (name: string, option: string) => void
    onChange: (e: OnChangeEvent) => void
    onItemChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void
    onDeleteItem: (id: string) => void
    onAddItem: () => void
    formRef: RefObject<HTMLFormElement>
    draft?: boolean
}

export const InvoiceForm = ({
    formData,
    onSubmit,
    errors,
    onSelectChange,
    onChange,
    onItemChange,
    onDeleteItem,
    onAddItem,
    onSelectedDayChange,
    formRef,
    draft = false,
}: InvoiceFormProps) => {
    const selectedDay = new Date(formData.date)

    return (
        <form
            id="invoice-form"
            onSubmit={onSubmit}
            ref={formRef}
            className="max-h-[100%] overflow-y-auto pr-3 grid gap-4 pb-28"
        >
            <legend className="font-semibold text-accent-700">Bill from</legend>
            <fieldset className="grid gap-5 mb-4 md:gap-6">
                <FloatingLabel
                    invalid={errors["billFrom:streetAddress"]}
                    htmlFor="billFrom:streetAddress"
                    text={"Street Address"}
                >
                    <Input
                        invalid={errors["billFrom:streetAddress"]}
                        value={formData.billFrom.streetAddress}
                        onChange={(e) => onChange(e)}
                        id="billFrom:streetAddress"
                        name="billFrom:streetAddress"
                        type="text"
                    />
                </FloatingLabel>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3 md:gap-6">
                    <FloatingLabel
                        invalid={errors["billFrom:city"]}
                        htmlFor="billFrom:city"
                        text={"City"}
                    >
                        <Input
                            invalid={errors["billFrom:city"]}
                            value={formData.billFrom.city}
                            onChange={onChange}
                            name="billFrom:city"
                            id="billFrom:city"
                            type="text"
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        invalid={errors["billFrom:postCode"]}
                        htmlFor="billFrom:postCode"
                        text={"Post Code"}
                    >
                        <Input
                            invalid={errors["billFrom:postCode"]}
                            value={formData.billFrom.postCode}
                            onChange={onChange}
                            name="billFrom:postCode"
                            id="billFrom:postCode"
                            type="text"
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        invalid={errors["billFrom:country"]}
                        htmlFor="billFrom:country"
                        text={"Country"}
                    >
                        <Input
                            invalid={errors["billFrom:country"]}
                            value={formData.billFrom.country}
                            onChange={onChange}
                            name="billFrom:country"
                            id="billFrom:country"
                            type="text"
                        />
                    </FloatingLabel>
                </div>
            </fieldset>

            <legend className="font-semibold text-accent-700">Bill to</legend>

            <fieldset className="grid gap-5 md:gap-6">
                <FloatingLabel
                    invalid={errors["billTo:clientName"]}
                    htmlFor="billTo:clientName"
                    text={"Client's Name"}
                >
                    <Input
                        invalid={errors["billTo:clientName"]}
                        value={formData.billTo.clientName}
                        onChange={onChange}
                        name="billTo:clientName"
                        id="billTo:clientName"
                        type="text"
                    />
                </FloatingLabel>
                <FloatingLabel
                    invalid={errors["billTo:clientEmail"]}
                    htmlFor="billTo:clientEmail"
                    text={"Client's Email"}
                >
                    <Input
                        invalid={errors["billTo:clientEmail"]}
                        pattern={emailPattern}
                        value={formData.billTo.clientEmail}
                        onChange={onChange}
                        name="billTo:clientEmail"
                        id="billTo:clientEmail"
                        type="email"
                    />
                </FloatingLabel>
                <FloatingLabel
                    invalid={errors["billTo:streetAddress"]}
                    htmlFor="billTo:streetAddress"
                    text={"Street Address"}
                >
                    <Input
                        invalid={errors["billTo:streetAddress"]}
                        value={formData.billTo.streetAddress}
                        onChange={onChange}
                        name="billTo:streetAddress"
                        id="billTo:streetAddress"
                        type="text"
                    />
                </FloatingLabel>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3 md:gap-6">
                    <FloatingLabel
                        invalid={errors["billTo:city"]}
                        htmlFor="billTo:city"
                        text={"City"}
                    >
                        <Input
                            invalid={errors["billTo:city"]}
                            value={formData.billTo.city}
                            onChange={onChange}
                            name="billTo:city"
                            id="billTo:city"
                            type="text"
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        invalid={errors["billTo:postCode"]}
                        htmlFor="billTo:postCode"
                        text={"Post Code"}
                    >
                        <Input
                            invalid={errors["billTo:postCode"]}
                            value={formData.billTo.postCode}
                            onChange={onChange}
                            name="billTo:postCode"
                            id="billTo:postCode"
                            type="text"
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        invalid={errors["billTo:country"]}
                        htmlFor="billTo:country"
                        text={"Country"}
                    >
                        <Input
                            invalid={errors["billTo:country"]}
                            value={formData.billTo.country}
                            onChange={onChange}
                            name="billTo:country"
                            id="billTo:country"
                            type="text"
                        />
                    </FloatingLabel>
                </div>
            </fieldset>

            <fieldset className="grid gap-5 md:gap-6">
                <div className="grid grid-cols-2 gap-3 md:gap-6">
                    <div>
                        <label
                            className={labelClassName}
                            htmlFor="date"
                        >
                            Invoice Date
                        </label>
                        <DatePicker
                            selectedDay={
                                new Date(selectedDay.setHours(0, 0, 0, 0))
                            }
                            onSelectedDayChange={onSelectedDayChange}
                        />
                    </div>
                    <div className="w-full">
                        <label
                            className={labelClassName}
                            htmlFor="paymentTerms"
                        >
                            Payment Terms
                        </label>
                        <Select
                            currOption={formData.paymentTerms}
                            options={[
                                "Net 1 day",
                                "Net 7 days",
                                "Net 14 days",
                                "Net 30 days",
                            ]}
                            onChange={(o) => onSelectChange("paymentTerms", o)}
                        />
                    </div>
                </div>
                <FloatingLabel
                    invalid={errors["description"]}
                    htmlFor="description"
                    text={"Description"}
                >
                    <Input
                        invalid={errors["description"]}
                        value={formData.description}
                        onChange={onChange}
                        name="description"
                        id="description"
                        type="text"
                    />
                </FloatingLabel>
            </fieldset>

            <div className="flex flex-col gap-3 md:gap-4">
                <InvoiceItemsList
                    items={formData.items}
                    errors={errors}
                    onChange={onItemChange}
                    onDeleteItem={onDeleteItem}
                    onAddItem={onAddItem}
                />
            </div>
        </form>
    )
}
