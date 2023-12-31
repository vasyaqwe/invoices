import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient, useMutation } from "react-query"
import { FloatingLabel } from "@/components/ui/FloatingLabel"
import { Input } from "@/components/ui/Input"
import { useErrorToast } from "@/hooks/useErrorToast"
import { useFormValidation } from "@/hooks/useFormValidation"
import { createUser } from "@/api/users"
import { useStore } from "@/stores/useStore"
import { Button } from "@/components/ui/Button"
import { GoogleLoginButton } from "@/components/ui/GoogleLoginButton"
import { UserFormData } from "@/types"
import { signUpSchema } from "@/lib/validations/signUp"
import { useAuthStore } from "@/stores/useAuthStore"

export const SignUp = () => {
    const queryClient = useQueryClient()
    const { setToken } = useAuthStore()
    const { openToast } = useStore()

    const [formData, setFormData] = useState<UserFormData>({
        username: "",
        password: "",
        confirmPassword: "",
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
            onSuccess: ({ accessToken }) => {
                queryClient.invalidateQueries(["auth"])
                navigate("/")
                setToken(accessToken)
                openToast({ text: "Welcome!" })
            },
        }
    )

    const { errors, safeOnSubmit } = useFormValidation({
        onSubmit,
        formData,
        zodSchema: signUpSchema,
    })

    useErrorToast(error)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <>
            <form
                className="flex flex-col max-w-md gap-5 mx-auto form"
                onSubmit={(e) => {
                    e.preventDefault()
                    safeOnSubmit()
                }}
            >
                <h1 className="text-4xl font-semibold">Sign Up</h1>
                <FloatingLabel
                    invalid={errors.username}
                    htmlFor="username"
                    text={"Username"}
                >
                    <Input
                        invalid={errors.username}
                        value={formData.username}
                        onChange={onChange}
                        id="username"
                        name="username"
                        type="username"
                    />
                </FloatingLabel>

                <FloatingLabel
                    invalid={errors.password}
                    htmlFor="password"
                    text={"Password"}
                >
                    <Input
                        invalid={errors.password}
                        value={formData.password}
                        onChange={onChange}
                        id="password"
                        name="password"
                        type="password"
                    />
                </FloatingLabel>

                <FloatingLabel
                    invalid={errors.confirmPassword}
                    htmlFor="confirmPassword"
                    text={"Repeat password"}
                >
                    <Input
                        invalid={errors.confirmPassword}
                        value={formData.confirmPassword}
                        onChange={onChange}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                    />
                </FloatingLabel>

                <div className="flex flex-wrap items-center justify-between gap-6">
                    <Button
                        isLoading={isLoading}
                        disabled={isLoading}
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
