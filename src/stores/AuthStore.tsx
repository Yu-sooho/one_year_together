import {StateCreator, create} from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {createJSONStorage, persist, PersistOptions} from 'zustand/middleware'

interface AuthState {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

type MyPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>,
) => StateCreator<AuthState>

const useAuthStore = create<AuthState>(
  (persist as MyPersist)(
    set => ({
      isLoggedIn: false,
      login: () => set({isLoggedIn: true}),
      logout: () => set({isLoggedIn: false}),
    }),
    {
      name: 'auth-storage', // storage key
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        // 상태 복원이 완료된 후 호출되는 콜백
        console.log('State rehydrated', state)
      },
    },
  ),
)

export default useAuthStore
