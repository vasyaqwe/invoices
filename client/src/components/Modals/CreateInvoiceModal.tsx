import { useRef, useState } from "react"
import { InvoiceFormData, Item, PaymentTerms, Status } from "../../types"
import { createInvoice, createInvoiceDraft } from "../../api/invoices"
import { useMutation, useQueryClient } from "react-query"
import { motion } from 'framer-motion'
import { useErrorToast } from '../../hooks/useErrorToast'
import { useStore } from "../../stores/useStore"
import { nanoid } from 'nanoid'
import { Select, SelectOption } from "../Select"
import { DatePicker } from "../DatePicker"
import { ItemList } from "../ItemList"
import { FloatingLabel } from "../FloatingLabel"
import { Input } from "../Input"
import { emailPattern, labelClassName } from "../../utils"
import { useInputValidation } from "../../hooks/useInputValidation"
import { Spinner } from "../Spinner"
import { useAuth } from "../../hooks/useAuth"

export const CreateInvoiceModal = () => {
    const { closeModal, openToast } = useStore()
    const currentUser = useAuth()
    const [draft, setDraft] = useState(false)
    const today = Date.now()

    const [formData, setFormData] = useState<InvoiceFormData>({
        user: currentUser!.userId,
        billFrom: {
            streetAddress: '',
            city: '',
            postCode: '',
            country: ''
        },
        billTo: {
            clientName: '',
            clientEmail: '',
            streetAddress: '',
            city: '',
            postCode: '',
            country: '',
        },
        date: new Date(today),
        status: Status.Pending,
        paymentTerms: PaymentTerms.OneDay,
        description: '',
        items: [{ name: '', price: 0, quantity: 0, id: nanoid() }]
    })

    const formContentRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const itemsRef = useRef<HTMLDivElement>(null)
    const {
        validateInputs,
        makeItemInputValid,
        makeInputValid,
        errors
    } = useInputValidation(formRef, itemsRef)

    const queryClient = useQueryClient()
    const { isLoading, error, mutate: onSave } = useMutation(
        () => createInvoice(formData), {
        onSuccess: () => {
            queryClient.invalidateQueries(['invoices'])
            closeModal('createInvoice')
            openToast({ text: 'Invoice created!' })
        }
    })
    useErrorToast(error)

    const { mutate: onSaveAsDraft } = useMutation(
        () => createInvoiceDraft({ ...formData, status: Status.Draft }), {
        onSuccess: () => {
            queryClient.invalidateQueries(['invoices'])
            closeModal('createInvoice')
        }
    })

    const onAddItem = () => {
        const newItem: Item = { name: '', quantity: 0, price: 0, id: nanoid() }
        setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }))
        setTimeout(() => {
            formContentRef.current && formContentRef.current.scrollTo({ top: 99999, behavior: 'smooth' })
        }, 100)
    }
    const onDeleteItem = (id: string) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }))
        const removedRow = formData.items.find(t => t.id === id)
        if (removedRow) {
            const removedRowIdx = formData.items.indexOf(removedRow)
            makeInputValid('name' + removedRowIdx)
            makeInputValid('quantity' + removedRowIdx)
            makeInputValid('price' + removedRowIdx)
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (name.includes(':')) {
            const newName = name.split(':')
            const firstName = newName[0]
            const secondName = newName[1]
            setFormData((prev) => ({ ...prev, [firstName]: { ...prev[firstName], [secondName]: value } }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
        makeInputValid(e.target.name)
    }

    const onItemChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const { name, value, dataset } = e.target
        setFormData((prev) => ({
            ...prev, items:
                prev.items.map(item => item.id === id ? ({ ...item, [name]: value }) : item)
        }))
        makeItemInputValid(e)
    }

    const onSelectChange = (name: string, option: SelectOption) => {
        setFormData(prev => ({ ...prev, [name]: option }))
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSave()
    }

    return (
        <motion.dialog open className='bg-primary-900 min-h-screen p-6 top-[80px] w-full max-w-2xl md:left-[100px] md:top-0 modal modal--screen'
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
        >
            <form ref={formRef} className="grid grid-rows-[min-content,1fr,min-content] h-[calc(100vh-80px)] md:h-full
            p-7 md:p-12" onSubmit={onSubmit}>
                <h2 className="text-white text-4xl font-bold mb-4">Create Invoice</h2>
                <div ref={formContentRef} className="max-h-[100%] overflow-y-auto pr-3 grid gap-4 pb-28">
                    <legend className="text-accent-700 font-semibold">Bill from</legend>
                    <fieldset className="grid gap-3 md:gap-5 mb-4">
                        <FloatingLabel invalid={errors.includes('billFrom:streetAddress')} htmlFor="billFrom:streetAddress" text={'Street Address'}>
                            <Input invalid={errors.includes('billFrom:streetAddress')} value={formData.billFrom.streetAddress} onChange={onChange} id="billFrom:streetAddress"
                                name="billFrom:streetAddress" type="text" required={!draft} />
                        </FloatingLabel>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3 md:gap-6">
                            <FloatingLabel invalid={errors.includes('billFrom:city')} htmlFor="billFrom:city" text={'City'}>
                                <Input invalid={errors.includes('billFrom:city')} value={formData.billFrom.city} onChange={onChange} name="billFrom:city" id="billFrom:city" type="text" required={!draft} />
                            </FloatingLabel>
                            <FloatingLabel invalid={errors.includes('billFrom:postCode')} htmlFor="billFrom:postCode" text={'Post Code'}>
                                <Input invalid={errors.includes('billFrom:postCode')} value={formData.billFrom.postCode} onChange={onChange} name="billFrom:postCode" id="billFrom:postCode" type="text" required={!draft} />
                            </FloatingLabel>
                            <FloatingLabel invalid={errors.includes('billFrom:country')} htmlFor="billFrom:country" text={'Country'}>
                                <Input invalid={errors.includes('billFrom:country')} value={formData.billFrom.country} onChange={onChange} name="billFrom:country" id="billFrom:country" type="text" required={!draft} />
                            </FloatingLabel>
                        </div>
                    </fieldset>

                    <legend className="text-accent-700 font-semibold">Bill to</legend>

                    <fieldset className="grid gap-5 md:gap-6">
                        <FloatingLabel invalid={errors.includes('billTo:clientName')} htmlFor="billTo:clientName" text={"Client's Name"}>
                            <Input invalid={errors.includes('billTo:clientName')} value={formData.billTo.clientName} onChange={onChange} name="billTo:clientName" id="billTo:clientName" type="text" required={!draft} />
                        </FloatingLabel>
                        <FloatingLabel invalid={errors.includes('billTo:clientEmail')} htmlFor="billTo:clientEmail" text={"Client's Email"}>
                            <Input invalid={errors.includes('billTo:clientEmail')} pattern={emailPattern} value={formData.billTo.clientEmail} onChange={onChange} name="billTo:clientEmail" id="billTo:clientEmail" type="email" required={!draft} />
                        </FloatingLabel>
                        <FloatingLabel invalid={errors.includes('billTo:streetAddress')} htmlFor="billTo:streetAddress" text={"Street Address"}>
                            <Input invalid={errors.includes('billTo:streetAddress')} value={formData.billTo.streetAddress} onChange={onChange} name="billTo:streetAddress" id="billTo:streetAddress" type="text" required={!draft} />
                        </FloatingLabel>


                        <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3 md:gap-6">
                            <FloatingLabel invalid={errors.includes('billTo:city')} htmlFor="billTo:city" text={"City"}>
                                <Input invalid={errors.includes('billTo:city')} value={formData.billTo.city} onChange={onChange} name="billTo:city" id="billTo:city" type="text" required={!draft} />
                            </FloatingLabel>
                            <FloatingLabel invalid={errors.includes('billTo:postCode')} htmlFor="billTo:postCode" text={"Post Code"}>
                                <Input invalid={errors.includes('billTo:postCode')} value={formData.billTo.postCode} onChange={onChange} name="billTo:postCode" id="billTo:postCode" type="text" required={!draft} />
                            </FloatingLabel>
                            <FloatingLabel invalid={errors.includes('billTo:country')} htmlFor="billTo:country" text={"Country"}>
                                <Input invalid={errors.includes('billTo:country')} value={formData.billTo.country} onChange={onChange}
                                    name="billTo:country" id="billTo:country" type="text" required={!draft} />
                            </FloatingLabel>
                        </div>
                    </fieldset>

                    <fieldset className="grid gap-3 md:gap-6">
                        <div className="grid grid-cols-2  gap-3 md:gap-6">
                            <div>
                                <label className={labelClassName} htmlFor="date">Invoice Date</label>
                                <DatePicker />
                            </div>
                            <div className="w-full">
                                <label className={labelClassName} htmlFor="paymentTerms">Payment Terms</label>
                                <Select currOption={formData.paymentTerms}
                                    options={Object.values(PaymentTerms)}
                                    onChange={o => onSelectChange('paymentTerms', o)} />
                            </div>
                        </div>
                        <FloatingLabel invalid={errors.includes('description')} htmlFor="description" text={"Description"}>
                            <Input invalid={errors.includes('description')} value={formData.description} onChange={onChange} name="description" id="description" type="text" required={!draft} />
                        </FloatingLabel>
                    </fieldset>

                    <div className="flex flex-col gap-3 md:gap-4" ref={itemsRef}>
                        <ItemList items={formData.items}
                            errors={errors}
                            onChange={onItemChange}
                            draft={draft}
                            onDeleteItem={onDeleteItem}
                            onAddItem={onAddItem}
                        />
                    </div>
                </div>
                <div className="py-6 flex items-center justify-between flex-wrap gap-3">
                    <button type="button" onClick={() => closeModal('createInvoice')} className="rounded-full text-sm sm:text-base bg-primary-600 font-semibold text-white py-3 px-4">Discard</button>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => {
                            setDraft(true)
                            onSaveAsDraft()
                            closeModal('createInvoice')
                            openToast({ text: 'Draft saved!' })
                        }}
                            className="rounded-full text-sm sm:text-base bg-neutral-700 font-semibold text-white py-3 px-5">Save as Draft</button>
                        <button onClick={validateInputs}
                            disabled={isLoading}
                            className={`rounded-full text-sm
                            flex items-center gap-2
                             sm:text-base ${isLoading ? 'opacity-80 cursor-default' : ""} bg-accent-700 font-semibold text-white py-3 px-5`}>
                            {isLoading && <Spinner />}
                            Save & Send</button>
                    </div>
                </div>
            </form >
        </motion.dialog>
    )
}
