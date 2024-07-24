import {EdgeInsets} from 'react-native-safe-area-context'
import Toast, {BaseToast} from 'react-native-toast-message'
import {create, StateCreator} from 'zustand'
import {ToastTypes} from '../types/ComponentTypes'
import {normalize} from '../utils'
import useFirebaseStore from './FirebaseStore'
import {createJSONStorage, persist, PersistOptions} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
}

const useAppStateStore = create<AppState>((set, get) => {
  const firebaseStore = useFirebaseStore.getState()
  return {
    inset: null,
    setHomeImageUrl: async ({homeImagePath}) => {
      if (homeImagePath) {
        const result = await firebaseStore.uploadImage(
          `settings/homeImage`,
          homeImagePath,
        )
        return result
      }

      const result = await firebaseStore.deleteDataToRdb(
        '/settings/homeImageUrl',
      )
      return result
    },
    setWidgetImageUrl: async ({widgetImagePath}) => {
      if (widgetImagePath) {
        const result = await firebaseStore.uploadImage(
          `settings/widgetImage`,
          widgetImagePath,
        )
        return true
      }
      return false
    },
    addSetting: async setting => {
      const result = await firebaseStore.addDataToOriginRdb(
        '/settings',
        setting,
      )
      return result
    },
    settingData: null,
    subscribeSetting: () => {
      return firebaseStore.subscribeRdbObj('/settings', data => {
        set({settingData: data})
      })
    },
    unsubscribeSetting: () => {
      firebaseStore.unSubscribeRdb('/settings', get().subscribeSetting)
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
})

export default useAppStateStore
