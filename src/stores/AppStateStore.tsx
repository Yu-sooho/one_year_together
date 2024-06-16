import {EdgeInsets} from 'react-native-safe-area-context'
import Toast, {BaseToast} from 'react-native-toast-message'
import {create} from 'zustand'
import {ToastTypes} from '../types/ComponentTypes'
import {normalize} from '../utils'

interface AppState {
  inset: EdgeInsets | null
  setInset: (inset: EdgeInsets) => void

  isLoading: boolean
  setIsLoading: (force?: boolean) => void
  showToast: (message: string, type?: ToastTypes['type']) => void
}

const useAppStateStore = create<AppState>((set, get) => ({
  inset: null,
  setInset: inset => {
    set({
      inset,
    })
  },
  isLoading: false,
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
}))

export default useAppStateStore
