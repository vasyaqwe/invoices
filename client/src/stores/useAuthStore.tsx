import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

interface StoreState {
    token: string | null
    setToken: (token: string | null) => void
    persist: boolean
    setPersist: (value: boolean) => void
}

export const useAuthStore = create<StoreState>()(
    devtools(
        persist(
            (set) => ({
                token: null,
                setToken: (token) => set(() => ({ token })),
                persist: true,
                setPersist: (persist) => set(() => ({ persist }))
            }),
            {
                name: 'auth',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({ persist: state.persist })
            }
        )
    )
)