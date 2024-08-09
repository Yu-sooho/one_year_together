import {EdgeInsets} from 'react-native-safe-area-context'
import Toast, {BaseToast} from 'react-native-toast-message'
import {create, StateCreator} from 'zustand'
import {ToastTypes} from '../types/ComponentTypes'
import {normalize} from '../utils'
import useFirebaseStore from './FirebaseStore'
import {createJSONStorage, persist, PersistOptions} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useAuthStore from './AuthStore'
import useAppStateStore from './AppStateStore'
import {FirebaseDatabaseTypes} from '@react-native-firebase/database'

interface NotifeeState {
  notifeeData: NotifeeModel[] | null
  subscribeNotifee: () => void
  unsubscribeNotifee: () => void
  deleteNotifee: (notifeeList: NotifeeModel[]) => void
  checkDuplicated: (
    key: string,
  ) => Promise<false | FirebaseDatabaseTypes.DataSnapshot>
  updateNotifee: (
    notifee: NotifeeModel,
    snapshot: FirebaseDatabaseTypes.DataSnapshot,
  ) => Promise<boolean>
}

const useNotifeeStore = create<NotifeeState>((set, get) => {
  const appStateStore = useAppStateStore.getState()
  const firebaseStore = useFirebaseStore.getState()
  return {
    notifeeData: null,
    subscribeNotifee: () => {
      const authStore = useAuthStore.getState()
      const uid = authStore.currentUser?.uid
      if (!uid) {
        appStateStore.showToast('로그아웃 했다가 다시 시도해줄래?')
        return false
      }
      return firebaseStore.subscribeRdb(`/notifees/${uid}`, data => {
        set({notifeeData: data})
      })
    },
    unsubscribeNotifee: () => {
      const authStore = useAuthStore.getState()
      const uid = authStore.currentUser?.uid
      if (!uid) {
        appStateStore.showToast('로그아웃 했다가 다시 시도해줄래?')
        return false
      }
      firebaseStore.unSubscribeRdb(`/notifees/${uid}`, get().subscribeNotifee)
    },
    updateNotifee: async (notifee, snapshot) => {
      const authStore = useAuthStore.getState()
      const uid = authStore.currentUser?.uid
      const result = await firebaseStore.updateDataToRdb(
        `/notifees/${uid}`,
        notifee,
        snapshot,
      )
      return result
    },
    checkDuplicated: async key => {
      const authStore = useAuthStore.getState()
      const uid = authStore.currentUser?.uid
      const checkDuplicated = await firebaseStore.checkDuplicate(
        `notifees/${uid}`,
        'key',
        key,
      )
      return checkDuplicated
    },
    deleteNotifee: async notifeeList => {
      const authStore = useAuthStore.getState()
      const uid = authStore.currentUser?.uid
      try {
        for (const notifee of notifeeList) {
          console.log(`notifeeList deleteNotifee`, notifee)
          const notifeeKey = notifee.key
          await firebaseStore.deleteDataToRdb(`/notifees/${uid}/${notifeeKey}`)
        }
        return true
      } catch (error) {
        console.log('deleteNotifee error', error)
        return false
      }
    },
  }
})

export default useNotifeeStore
