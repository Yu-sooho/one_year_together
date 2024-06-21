import {StateCreator, create} from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {createJSONStorage, persist, PersistOptions} from 'zustand/middleware'
import {FirebaseAuthTypes} from '@react-native-firebase/auth'
import {GoogleSignin, User} from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'

interface AuthState {
  isLoggedIn: boolean
  login: () => void
  logout: () => Promise<boolean>
  currentUser: FirebaseAuthTypes.User | null
  setCurrentUser: (user: FirebaseAuthTypes.User | null) => void
}

interface persistOption {
  isLoggedIn: boolean
}

type MyPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState, persistOption>,
) => StateCreator<AuthState>

const useAuthStore = create<AuthState>(
  (persist as MyPersist)(
    (set, get) => ({
      isLoggedIn: false,
      login: () => set({isLoggedIn: true}),
      logout: async () => {
        try {
          await GoogleSignin.signOut()
          await auth().signOut()
          set({isLoggedIn: false})
          return true
        } catch (error) {
          console.log(`[AuthStore] logout error: ${error}`)
          return false
        }
      },
      currentUser: null,
      setCurrentUser: user => set({currentUser: user}),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({isLoggedIn: state.isLoggedIn}),
      onRehydrateStorage: () => state => {
        console.log('State rehydrated', state)
      },
    },
  ),
)

export default useAuthStore
