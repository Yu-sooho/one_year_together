import {StateCreator, create} from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {createJSONStorage, persist, PersistOptions} from 'zustand/middleware'
import {FirebaseAuthTypes} from '@react-native-firebase/auth'
import {GoogleSignin, User} from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'
import useAppStateStore from './AppStateStore'
import useFirebaseStore from './FirebaseStore'

interface AuthState {
  isLoggedIn: boolean
  login: () => void
  logout: () => Promise<boolean>
  currentUser: FirebaseAuthTypes.User | null
  loginedUser: UserModel | null
  setCurrentUser: (user: FirebaseAuthTypes.User | null) => void
  addUsersSetting: (user: UserModel) => void
  subscribeUser: () => void
  unsubscribeUser: () => void
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
    (set, get) => {
      const appStateStore = useAppStateStore.getState()
      const firebaseStore = useFirebaseStore.getState()

      return {
        isLoggedIn: false,
        login: () => set({isLoggedIn: true}),
        logout: async () => {
          try {
            set({isLoggedIn: false})
            await GoogleSignin.signOut()
            await auth().signOut()
            return true
          } catch (error) {
            console.log(`[AuthStore] logout error: ${error}`)
            return false
          }
        },
        loginedUser: null,
        currentUser: null,
        setCurrentUser: user => set({currentUser: user}),
        addUsersSetting: async user => {
          const currentUser = get().currentUser
          const loginedUser = get().loginedUser

          if (!loginedUser) {
            console.log(loginedUser, '로그인 데이터 없음')
            return false
          }

          const defaultUser = {
            email: currentUser?.email,
            ...loginedUser,
          }

          if (!currentUser?.uid) {
            appStateStore.showToast('로그아웃 했다가 다시 시도해줄래?')
            return false
          }
          const result = await firebaseStore.addDataToOriginRdb(
            `/users/${currentUser.uid}`,
            {...defaultUser, ...user},
          )
          return result
        },
        subscribeUser: () => {
          const appStateStore = useAppStateStore.getState()
          const uid = get().currentUser?.uid
          if (!uid) {
            appStateStore.showToast('로그아웃 했다가 다시 시도해줄래?')
            return false
          }
          return firebaseStore.subscribeRdbObj(`/users/${uid}`, data => {
            set({loginedUser: data})
          })
        },
        unsubscribeUser: () => {
          const appStateStore = useAppStateStore.getState()
          const uid = get().currentUser?.uid
          if (!uid) {
            appStateStore.showToast('로그아웃 했다가 다시 시도해줄래?')
            return false
          }
          firebaseStore.unSubscribeRdb(`/settings/${uid}`, get().subscribeUser)
        },
      }
    },
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({isLoggedIn: state.isLoggedIn}),
      onRehydrateStorage: () => state => {
        console.log('State rehydrated authState', state)
      },
    },
  ),
)

export default useAuthStore
