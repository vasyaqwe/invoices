import { ElementRef, RefObject, useRef } from "react"
import { FloatingLabel } from "./FloatingLabel"
import { InvoiceFormData, PaymentTerms } from "../types"
import { Input } from "./Input"
import { emailPattern, labelClassName } from "../utils"
import { DatePicker } from "./DatePicker"
import { Select, SelectOption } from "./Select"
import { ItemList } from "./ItemList"

export type OnChangeEvent = React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement
>

type InvoiceFormProps = {
    formData: InvoiceFormData
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    errors: string[]
    onSelectChange: (name: string, option: SelectOption) => void
    onChange: (e: OnChangeEvent) => void
    onItemChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void
    onDeleteItem: (id: string) => void
    onAddItem: () => void
    itemsRef: RefObject<HTMLDivElement>
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
    itemsRef,
    formRef,
    draft = false,
}: InvoiceFormProps) => {
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
                    invalid={errors.includes("billFrom:streetAddress")}
                    htmlFor="billFrom:streetAddress"
                    text={"Street Address"}
                >
                    <Input
                        invalid={errors.includes("billFrom:streetAddress")}
                        value={formData.billFrom.streetAddress}
                        onChange={(e) => onChange(e)}
                        id="billFrom:streetAddress"
                        name="billFrom:streetAddress"
                        type="text"
                        required={!draft}
                    />
                </FloatingLabel>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3 md:gap-6">
                    <FloatingLabel
                        invalid={errors.includes("billFrom:city")}
                        htmlFor="billFrom:city"
                        text={"City"}
                    >
                        <Input
                            invalid={errors.includes("billFrom:city")}
                            value={formData.billFrom.city}
                            onChange={onChange}
                            name="billFrom:city"
                            id="billFrom:city"
                            type="text"
                            required={!draft}
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        invalid={errors.includes("billFrom:postCode")}
                        htmlFor="billFrom:postCode"
                        text={"Post Code"}
                    >
                        <Input
                            invalid={errors.includes("billFrom:postCode")}
                            value={formData.billFrom.postCode}
                            onChange={onChange}
                            name="billFrom:postCode"
                            id="billFrom:postCode"
                            type="text"
                            required={!draft}
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        invalid={errors.includes("billFrom:country")}
                        htmlFor="billFrom:country"
                        text={"Country"}
                    >
                        <Input
                            invalid={errors.includes("billFrom:country")}
                            value={formData.billFrom.country}
                            onChange={onChange}
                            name="billFrom:country"
                            id="billFrom:country"
                            type="text"
                            required={!draft}
                        />
                    </FloatingLabel>
                </div>
            </fieldset>

            <legend className="font-semibold text-accent-700">Bill to</legend>

            <fieldset className="grid gap-5 md:gap-6">
                <FloatingLabel
                    invalid={errors.includes("billTo:clientName")}
                    htmlFor="billTo:clientName"
                    text={"Client's Name"}
                >
                    <Input
                        invalid={errors.includes("billTo:clientName")}
                        value={formData.billTo.clientName}
                        onChange={onChange}
                        name="billTo:clientName"
                        id="billTo:clientName"
                        type="text"
                        required={!draft}
                    />
                </FloatingLabel>
                <FloatingLabel
                    invalid={errors.includes("billTo:clientEmail")}
                    htmlFor="billTo:clientEmail"
                    text={"Client's Email"}
                >
                    <Input
                        invalid={errors.includes("billTo:clientEmail")}
                        pattern={emailPattern}
                        value={formData.billTo.clientEmail}
                        onChange={onChange}
                        name="billTo:clientEmail"
                        id="billTo:clientEmail"
                        type="email"
                        required={!draft}
                    />
                </FloatingLabel>
                <FloatingLabel
                    invalid={errors.includes("billTo:streetAddress")}
                    htmlFor="billTo:streetAddress"
                    text={"Street Address"}
                >
                    <Input
                        invalid={errors.includes("billTo:streetAddress")}
                        value={formData.billTo.streetAddress}
                        onChange={onChange}
                        name="billTo:streetAddress"
                        id="billTo:streetAddress"
                        type="text"
                        required={!draft}
                    />
                </FloatingLabel>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3 md:gap-6">
                    <FloatingLabel
                        invalid={errors.includes("billTo:city")}
                        htmlFor="billTo:city"
                        text={"City"}
                    >
                        <Input
                            invalid={errors.includes("billTo:city")}
                            value={formData.billTo.city}
                            onChange={onChange}
                            name="billTo:city"
                            id="billTo:city"
                            type="text"
                            required={!draft}
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        invalid={errors.includes("billTo:postCode")}
                        htmlFor="billTo:postCode"
                        text={"Post Code"}
                    >
                        <Input
                            invalid={errors.includes("billTo:postCode")}
                            value={formData.billTo.postCode}
                            onChange={onChange}
                            name="billTo:postCode"
                            id="billTo:postCode"
                            type="text"
                            required={!draft}
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        invalid={errors.includes("billTo:country")}
                        htmlFor="billTo:country"
                        text={"Country"}
                    >
                        <Input
                            invalid={errors.includes("billTo:country")}
                            value={formData.billTo.country}
                            onChange={onChange}
                            name="billTo:country"
                            id="billTo:country"
                            type="text"
                            required={!draft}
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
                        <DatePicker />
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
                            options={Object.values(PaymentTerms)}
                            onChange={(o) => onSelectChange("paymentTerms", o)}
                        />
                    </div>
                </div>
                <FloatingLabel
                    invalid={errors.includes("description")}
                    htmlFor="description"
                    text={"Description"}
                >
                    <Input
                        invalid={errors.includes("description")}
                        value={formData.description}
                        onChange={onChange}
                        name="description"
                        id="description"
                        type="text"
                        required={!draft}
                    />
                </FloatingLabel>
            </fieldset>

            <div
                className="flex flex-col gap-3 md:gap-4"
                ref={itemsRef}
            >
                <ItemList
                    items={formData.items}
                    errors={errors}
                    onChange={onItemChange}
                    draft={draft}
                    onDeleteItem={onDeleteItem}
                    onAddItem={onAddItem}
                />
            </div>
        </form>
    )
}
