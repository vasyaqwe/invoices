import { useAuthStore } from '../stores/useAuthStore'
import jwtDecode from 'jwt-decode'

export const useAuth = () => {
    const { token } = useAuthStore()

    if (token) {
        const decoded: { userId: string, email: string, verificationToken: string } = jwtDecode(token)
        return decoded
    }
}
