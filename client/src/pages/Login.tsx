import { useRef, useState, } from 'react'
import { useNavigate, } from 'react-router-dom'
import { useQueryClient, useMutation } from 'react-query'
import { login } from '../api/auth'
import { useAuthStore } from '../stores/useAuthStore'
import { FloatingLabel } from '../components/FloatingLabel'
import { Input } from '../components/Input'
import { useErrorToast } from '../hooks/useErrorToast'
import { Checkbox } from '../components/Checkbox'
import { useInputValidation } from '../hooks/useInputValidation'
import { Spinner } from '../components/Spinner'

export const Login = () => {
    const queryClient = useQueryClient()
    const { setToken, setPersist, persist } = useAuthStore()

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const formRef = useRef<HTMLFormElement>(null)
    const {
        validateInputs,
        makeInputValid,
        errors
    } = useInputValidation(formRef)

    const navigate = useNavigate()

    const { isLoading, error, mutate: onSubmit } = useMutation(
        () => login(formData), {
        onSuccess: ({ accessToken }) => {
            queryClient.invalidateQueries(['auth'])
            setToken(accessToken)
            navigate('/')
            setFormData({ username: '', password: '' })
        }
    })
    useErrorToast(error)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        makeInputValid(name)
    }

    if (isLoading) return <p>Loading...</p>

    return (
        <>
            <form ref={formRef}
                className="form flex flex-col gap-5 max-w-md mx-auto"
                onSubmit={() => onSubmit()}>
                <h1 className="text-4xl font-semibold">Login</h1>
                <FloatingLabel invalid={errors.includes('username')} htmlFor="username" text={'Username'}>
                    <Input invalid={errors.includes('username')} required value={formData.username}
                        onChange={onChange} id="username"
                        name="username" type="username" />
                </FloatingLabel>

                <FloatingLabel invalid={errors.includes('password')} htmlFor="password" text={'Password'}>
                    <Input invalid={errors.includes('password')} required value={formData.password}
                        onChange={onChange} id="password"
                        name="password" type="password" />
                </FloatingLabel>
                <div className="flex flex-wrap items-center justify-between">
                    <Checkbox onChange={(value) => setPersist(value)}
                        id='persist-login'
                        checked={persist}
                        label={'Remember me'}
                    />
                    <button disabled={isLoading}
                        onClick={() => validateInputs()}
                        className={`rounded-full ${isLoading ? 'opacity-80 cursor-default' : ""} flex items-center gap-3
                         self-start py-2 px-7 bg-accent-700 font-semibold`}>
                        {isLoading && <Spinner />}

                        Login</button>
                </div>
            </form>
        </>
    )
}
