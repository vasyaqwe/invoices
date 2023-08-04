import { useGoogleLogin, GoogleLogin } from "@react-oauth/google"
import { useLocation, useNavigate } from "react-router-dom"
import { googleLogin } from "../api/auth"
import { useMutation, useQueryClient } from "react-query"
import { useAuthStore } from "../stores/useAuthStore"
import { useErrorToast } from "../hooks/useErrorToast"
import { Button } from "./Button"
import google from "../assets/google.png"

export const GoogleLoginButton = () => {
    const { setToken } = useAuthStore()

    const { pathname } = useLocation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { error, mutate: onSubmit } = useMutation(
        (code: string) => googleLogin(code),
        {
            onSuccess: ({ accessToken }) => {
                queryClient.invalidateQueries(["auth"])
                setToken(accessToken)
                navigate("/")
            },
        }
    )
    useErrorToast(error)

    const login = useGoogleLogin({
        onSuccess: (res) => {
            onSubmit(res.code)
        },
        flow: "auth-code",
    })

    return (
        <Button
            type="button"
            className="rounded-full border border-accent-700 justify-center"
            onClick={() => login()}
        >
            <img
                className="max-w-[1.5rem]"
                src={google}
                alt="Google"
            />
            {pathname.includes("signup") ? "Sign up" : "Log in"} in with Google
        </Button>
    )
}
