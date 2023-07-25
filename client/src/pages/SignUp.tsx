import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient, useMutation } from "react-query"
import { FloatingLabel } from "../components/FloatingLabel"
import { Input } from "../components/Input"
import { useErrorToast } from "../hooks/useErrorToast"
import { useInputValidation } from "../hooks/useInputValidation"
import { createUser } from "../api/users"
import { useStore } from "../stores/useStore"
import { usePasswordsValidation } from "../hooks/usePasswordsValidation"
import { ErrorMessage } from "../components/ErrorMessage"
import { Button } from "../components/Button"

export const SignUp = () => {
    const queryClient = useQueryClient()
    const { openToast } = useStore()
    const [submitted, setSubmitted] = useState(false)

    const [formData, setFormData] = useState({
        username: "",
        password1: "",
        password2: "",
    })

    const formRef = useRef<HTMLFormElement>(null)
    const { validateInputs, makeInputValid, errors } =
        useInputValidation(formRef)

    const {
        passwordsMatch,
        validateInputs: validatePasswords,
        onPasswordChange,
    } = usePasswordsValidation(formRef)

    const navigate = useNavigate()

    const {
        isLoading,
        error,
        mutate: onSubmit,
    } = useMutation(
        () =>
            createUser({
                username: formData.username,
                password: formData.password1,
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["auth"])
                navigate("/login")
                openToast({ text: "Sign up successful! Now, log in" })
                setFormData({ username: "", password1: "", password2: "" })
            },
        }
    )

    useErrorToast(error)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        makeInputValid(name)
        onPasswordChange(e)
    }

    const passwordsDontMatch = !passwordsMatch && submitted

    return (
        <>
            <form
                ref={formRef}
                className="form flex flex-col gap-5 max-w-md mx-auto"
                onSubmit={(e) => {
                    e.preventDefault()
                    if (passwordsMatch) onSubmit()
                }}
            >
                <h1 className="text-4xl font-semibold">Sign Up</h1>
                <FloatingLabel
                    invalid={errors.includes("username")}
                    htmlFor="username"
                    text={"Username"}
                >
                    <Input
                        invalid={errors.includes("username")}
                        required
                        value={formData.username}
                        onChange={onChange}
                        id="username"
                        name="username"
                        type="username"
                    />
                </FloatingLabel>

                <FloatingLabel
                    invalid={errors.includes("password1") || passwordsDontMatch}
                    htmlFor="password1"
                    text={"Password"}
                >
                    <Input
                        invalid={
                            errors.includes("password1") || passwordsDontMatch
                        }
                        required
                        value={formData.password1}
                        onChange={onChange}
                        id="password1"
                        name="password1"
                        type="password"
                    />
                </FloatingLabel>

                <FloatingLabel
                    invalid={errors.includes("password2") || passwordsDontMatch}
                    htmlFor="password2"
                    text={"Repeat password"}
                >
                    <Input
                        invalid={
                            errors.includes("password2") || passwordsDontMatch
                        }
                        required
                        value={formData.password2}
                        onChange={onChange}
                        id="password2"
                        name="password2"
                        type="password"
                    />
                </FloatingLabel>

                {passwordsDontMatch && (
                    <ErrorMessage message="Passwords don't match" />
                )}

                <div className="flex flex-wrap items-center justify-between">
                    <Button
                        isLoading={isLoading}
                        disabled={isLoading}
                        onClick={() => {
                            validateInputs()
                            validatePasswords()
                            setSubmitted(true)
                        }}
                        className={`self-start bg-accent-700`}
                    >
                        Sign Up
                    </Button>
                </div>
            </form>
        </>
    )
}
