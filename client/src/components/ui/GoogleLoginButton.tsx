import { useGoogleLogin } from "@react-oauth/google"
import { useLocation, useNavigate } from "react-router-dom"
import { googleLogin } from "@/api/auth"
import { useMutation, useQueryClient } from "react-query"
import { useAuthStore } from "@/stores/useAuthStore"
import { useErrorToast } from "@/hooks/useErrorToast"
import google from "@/assets/google.svg"
import { useStore } from "@/stores/useStore"

export const GoogleLoginButton = () => {
    const { setToken } = useAuthStore()

    const { openToast } = useStore()

    const { pathname } = useLocation()

    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const { error, mutate: onSubmit } = useMutation(
        (code: string) => googleLogin(code),
        {
            onSuccess: ({ accessToken }) => {
                queryClient.invalidateQueries(["auth"])
                openToast({ text: "Welcome!" })
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
        <button
            type="button"
            className="h-[40px] bg-white flex items-center text-primary-900 py-0 gap-[24px] px-5 rounded-full self-center"
            onClick={() => {
                login()
            }}
        >
            <img
                className="max-w-[1.5rem]"
                src={google}
                alt="Google"
            />
            {pathname.includes("signup") ? "Sign up" : "Sign in"} with Google
        </button>
    )
}
