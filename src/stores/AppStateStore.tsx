import {EdgeInsets} from 'react-native-safe-area-context'
import Toast, {BaseToast} from 'react-native-toast-message'
import {create, StateCreator} from 'zustand'
import {ToastTypes} from '../types/ComponentTypes'
import {normalize} from '../utils'
import useFirebaseStore from './FirebaseStore'
import {createJSONStorage, persist, PersistOptions} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useAuthStore from './AuthStore'

interface AppState {
  inset: EdgeInsets | null
  setInset: (inset: EdgeInsets) => void

  isMounted: boolean
  setIsMounted: (value: boolean) => void

  isLoading: boolean
  setIsLoading: (force?: boolean) => void
  showToast: (message: string, type?: ToastTypes['type']) => void

  setHomeImageUrl: ({
    homeImagePath,
  }: {
    homeImagePath: string | null
  }) => Promise<boolean | string>

  setWidgetImageUrl: ({
    widgetImagePath,
  }: {
    widgetImagePath: string | null
  }) => Promise<boolean>

  settingData?: SettingModel | null
  subscribeSetting: () => void
  unsubscribeSetting: () => void

  addSetting: (setting: SettingModel) => Promise<boolean>

  isAgreeNotifee: boolean
  setIsAgreeNotifee: (value: boolean) => void
}

interface persistOption {
  isAgreeNotifee: boolean
}

type MyPersist = (
  config: StateCreator<AppState>,
  options: PersistOptions<AppState, persistOption>,
) => StateCreator<AppState>

const useAppStateStore = create<AppState>(
  (persist as MyPersist)(
    (set, get) => {
      const firebaseStore = useFirebaseStore.getState()
      return {
        isAgreeNotifee: false,
        setIsAgreeNotifee: value => {
          set({
            isAgreeNotifee: value,
          })
        },
        inset: null,
        setHomeImageUrl: async ({homeImagePath}) => {
          const authStore = useAuthStore.getState()
          const uid = authStore.currentUser?.uid
          if (!uid) {
            get().showToast('로그아웃 했다가 다시 시도해줄래?')
            return false
          }
          if (homeImagePath) {
            const result = await firebaseStore.uploadImage(
              `settings/${uid}`,
              homeImagePath,
            )
            return result
          }

          const result = await firebaseStore.deleteDataToRdb(
            `/settings/${uid}/homeImageUrl`,
          )
          return result
        },
        setWidgetImageUrl: async ({widgetImagePath}) => {
          const authStore = useAuthStore.getState()
          const uid = authStore.currentUser?.uid
          if (!uid) {
            get().showToast('로그아웃 했다가 다시 시도해줄래?')
            return false
          }
          if (widgetImagePath) {
            const result = await firebaseStore.uploadImage(
              `settings/${uid}widgetImage`,
              widgetImagePath,
            )
            return true
          }
          return false
        },
        addSetting: async setting => {
          const authStore = useAuthStore.getState()
          const uid = authStore.currentUser?.uid
          const settingData = get().settingData
          if (!uid) {
            get().showToast('로그아웃 했다가 다시 시도해줄래?')
            return false
          }
          const result = await firebaseStore.addDataToOriginRdb(
            `/settings/${uid}`,
            {...settingData, ...setting},
          )
          return result
        },
        settingData: null,
        subscribeSetting: () => {
          const authStore = useAuthStore.getState()
          const uid = authStore.currentUser?.uid
          if (!uid) {
            get().showToast('로그아웃 했다가 다시 시도해줄래?')
            return false
          }
          return firebaseStore.subscribeRdbObj(`/settings/${uid}`, data => {
            set({settingData: data})
          })
        },
        unsubscribeSetting: () => {
          const authStore = useAuthStore.getState()
          const uid = authStore.currentUser?.uid
          if (!uid) {
            get().showToast('로그아웃 했다가 다시 시도해줄래?')
            return false
          }
          firebaseStore.unSubscribeRdb(
            `/settings/${uid}`,
            get().subscribeSetting,
          )
        },
        setInset: inset => {
          set({
            inset,
          })
        },
        isLoading: false,
        isMounted: false,
        setIsMounted: value => {
          set({
            isMounted: value,
          })
        },
        setIsLoading: force => {
          const loadingState = get().isLoading
          if (force) {
            set({
              isLoading: false,
            })
          }
          set({
            isLoading: !loadingState,
          })
        },
        showToast: async (message, type) => {
          const inset = await get().inset
          Toast.show({
            type: type || 'defaultToast',
            text1: message,
            position: 'bottom',
            visibilityTime: 3000,
            bottomOffset: (inset?.bottom || 0) + normalize(20),
          })
        },
      }
    },
    {
      name: 'appState-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({isAgreeNotifee: state.isAgreeNotifee}),
      onRehydrateStorage: () => state => {
        console.log('State rehydrated appState', state)
      },
    },
  ),
)

export default useAppStateStore
