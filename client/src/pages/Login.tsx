import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient, useMutation } from "react-query"
import { login } from "@/api/auth"
import { useAuthStore } from "@/stores/useAuthStore"
import { FloatingLabel } from "@/components/ui/FloatingLabel"
import { Input } from "@/components/ui/Input"
import { useErrorToast } from "@/hooks/useErrorToast"
import { Checkbox } from "@/components/ui/Checkbox"
import { useFormValidation } from "@/hooks/useFormValidation"
import { Button } from "@/components/ui/Button"
import { GoogleLoginButton } from "@/components/ui/GoogleLoginButton"
import { userSchema } from "@/lib/validations/user"
import { User } from "@/types"

export const Login = () => {
    const queryClient = useQueryClient()
    const { setToken, setPersist, persist } = useAuthStore()

    const [formData, setFormData] = useState<User>({
        username: "",
        password: "",
    })

    const navigate = useNavigate()

    const {
        isLoading,
        error,
        mutate: onSubmit,
    } = useMutation(() => login(formData), {
        onSuccess: ({ accessToken }) => {
            queryClient.invalidateQueries(["auth"])
            setToken(accessToken)
            navigate("/")
            setFormData({ username: "", password: "" })
        },
    })

    useErrorToast(error)

    const { errors, safeOnSubmit } = useFormValidation({
        onSubmit,
        formData,
        zodSchema: userSchema,
    })

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <>
            <form
                className="form flex flex-col gap-5 max-w-md mx-auto"
                onSubmit={(e) => {
                    e.preventDefault()
                    safeOnSubmit()
                }}
            >
                <h1 className="text-4xl font-semibold">Login</h1>
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
                <div className="flex flex-wrap items-center justify-between">
                    <Checkbox
                        onChange={(value) => setPersist(value)}
                        id="persist-login"
                        checked={persist}
                        label={"Remember me"}
                    />
                    <Button
                        disabled={isLoading}
                        isLoading={isLoading}
                        className={`self-start bg-accent-700`}
                    >
                        Login
                    </Button>
                </div>
                <GoogleLoginButton />
            </form>
        </>
    )
}
