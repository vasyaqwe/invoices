import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient, useMutation } from "react-query"
import { FloatingLabel } from "@/components/ui/FloatingLabel"
import { Input } from "@/components/ui/Input"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useFormValidation } from "@/hooks/useFormValidation"
import { createUser } from "@/api/users"
import { useStore } from "@/stores/useStore"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Button } from "@/components/ui/Button"
import { GoogleLoginButton } from "@/components/ui/GoogleLoginButton"
import { UserFormData } from "@/types"
import { userSchema } from "@/lib/validations/user"

export const SignUp = () => {
    const queryClient = useQueryClient()
    const { openToast } = useStore()
    const [submitted, setSubmitted] = useState(false)

    const [formData, setFormData] = useState<UserFormData>({
        username: "",
        password: "",
        confirmPassword: "",
    })

    const formRef = useRef<HTMLFormElement>(null)
    const { validateInputs, errors, validatePasswords, passwordsMatch } =
        useFormValidation<UserFormData>({
            formRef,
            formData,
            zodSchema: userSchema,
        })

    const navigate = useNavigate()

    const {
        isLoading,
        error,
        mutate: onSubmit,
    } = useMutation(
        () =>
            createUser({
                username: formData.username,
                password: formData.password,
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["auth"])
                navigate("/login")
                openToast({ text: "Sign up successful! Now, log in" })
                setFormData({ username: "", password: "", confirmPassword: "" })
            },
        }
    )

    useErrorToast(error)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
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
                    invalid={errors.includes("password") || passwordsDontMatch}
                    htmlFor="password"
                    text={"Password"}
                >
                    <Input
                        invalid={
                            errors.includes("password") || passwordsDontMatch
                        }
                        required
                        value={formData.password}
                        onChange={onChange}
                        id="password"
                        name="password"
                        type="password"
                    />
                </FloatingLabel>

                <FloatingLabel
                    invalid={
                        errors.includes("confirmPassword") || passwordsDontMatch
                    }
                    htmlFor="confirmPassword"
                    text={"Repeat password"}
                >
                    <Input
                        invalid={
                            errors.includes("confirmPassword") ||
                            passwordsDontMatch
                        }
                        required
                        value={formData.confirmPassword}
                        onChange={onChange}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                    />
                </FloatingLabel>

                {passwordsDontMatch && (
                    <ErrorMessage message="Passwords don't match" />
                )}

                <div className="flex items-center flex-wrap gap-6 justify-between">
                    <Button
                        isLoading={isLoading}
                        disabled={isLoading}
                        onClick={() => {
                            validateInputs()
                            validatePasswords()
                            setSubmitted(true)
                        }}
                        className={` bg-accent-700`}
                    >
                        Sign Up
                    </Button>
                    <GoogleLoginButton />
                </div>
            </form>
        </>
    )
}
