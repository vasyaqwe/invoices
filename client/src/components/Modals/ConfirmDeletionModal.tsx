import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { useMutation, useQueryClient } from 'react-query'
import { deleteInvoice } from '../../api/invoices'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '../Spinner'
import { useErrorToast } from '../../hooks/useErrorToast'

export const ConfirmDeletionModal = () => {
    const { currentInvoice, closeModal, openToast } = useStore()

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { isLoading, error, mutate: onDelete } = useMutation(
        () => deleteInvoice(currentInvoice?.id ?? ''), {
        onSuccess: () => {
            queryClient.invalidateQueries(['invoices', { id: currentInvoice?.id }])
            closeModal('confirmDeletion')
            openToast({ text: 'Invoice deleted!' })
            navigate('/')
        }
    })
    useErrorToast(error)

    return (
        <motion.dialog open className='bg-primary-700 inset-0 m-auto p-12 w-full max-w-lg modal'
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
        >
            <h2 className="text-white text-4xl font-bold mb-4">Confirm deletion</h2>
            <p className='text-neutral-400'>Are you sure you want to delete invoice #{currentInvoice?.id.toUpperCase()}? This action cannot be undone.</p>
            <div className="flex items-center gap-2 mt-3 justify-end">
                <button className='rounded-full bg-neutral-700 text-white py-3 px-6 font-semibold'
                    onClick={() => closeModal('confirmDeletion')}
                >Cancel</button>
                <button
                    disabled={isLoading}
                    className={`rounded-full text-white
                           flex items-center gap-2
                 bg-danger-400 py-3 px-6 ${isLoading ? 'opacity-80 cursor-default' : ""}font-semibold`}
                    onClick={() => onDelete()}>
                    {isLoading && <Spinner />}
                    Delete</button>
            </div>
        </motion.dialog>
    )
}
