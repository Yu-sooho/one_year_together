import {Linking, Platform} from 'react-native'
import {
  AndroidPermission,
  IOSPermission,
  PERMISSIONS,
  Permission,
  openSettings,
  requestMultiple,
} from 'react-native-permissions'
import {create} from 'zustand'
import {findKeyByValueForRecord} from '../utils'
import {StackNavigationProp} from '@react-navigation/stack'

const version = Number(Platform.Version)
const ANDROID_PERMISSION: Array<AndroidPermission> = [
  PERMISSIONS.ANDROID.CAMERA,
  version >= 33
    ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
    : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
]
const IOS_PERMISSION: Array<IOSPermission> = [
  PERMISSIONS.IOS.CAMERA,
  PERMISSIONS.IOS.MICROPHONE,
  PERMISSIONS.IOS.PHOTO_LIBRARY,
]
const SELCETED_PERMISSIONS: Array<Permission> =
  Platform.OS === 'ios' ? IOS_PERMISSION : ANDROID_PERMISSION

interface PermissionState {
  selectedPermission: Array<Permission>
  fcmToken: string | null
  setFcmToken: (token: string) => void
  checkPermission: () => Promise<Array<any>>
  openAppSettings: () => void
  openPermissionModal: (
    navigation: StackNavigationProp<MainStackNavigatorParamList>,
  ) => void
}

const usePermissionStore = create<PermissionState>((set, get) => ({
  selectedPermission: SELCETED_PERMISSIONS,
  fcmToken: null,
  setFcmToken: token => {
    set({
      fcmToken: token,
    })
  },
  checkPermission: async () => {
    const statuses = await requestMultiple(SELCETED_PERMISSIONS)
    const key = findKeyByValueForRecord(statuses, 'granted', true)
    return key
  },
  openAppSettings: () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:')
    } else {
      openSettings()
    }
  },
  openPermissionModal: navigation => {
    const openAppSettings = get().openAppSettings
    navigation.navigate('CustomModalScreen', {
      title: '권한 체크',
      contents: '필요권한이 없대ㅜ\n나 부르거나 앱 설정가서 권한 켜야해!!',
      okAction: openAppSettings,
    })
  },
}))

export default usePermissionStore
