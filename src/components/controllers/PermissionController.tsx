import React, {memo, useCallback, useEffect} from 'react'
import {requestMultiple} from 'react-native-permissions'
import {useAppStateStore, usePermissionStore} from '../../stores'
import {findKeyByValueForRecord} from '../../utils'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {PermissionsAndroid, Platform, View} from 'react-native'
import messaging from '@react-native-firebase/messaging'

const PermissionController = memo(() => {
  const navigation =
    useNavigation<StackNavigationProp<MainStackNavigatorParamList>>()
  const selectedPermission = usePermissionStore(
    state => state.selectedPermission,
  )

  const openAppSettings = usePermissionStore(state => state.openAppSettings)
  const setIsAgreeNotifee = useAppStateStore(state => state.setIsAgreeNotifee)
  const isCheckedPermission = usePermissionStore(
    state => state.isCheckedPermission,
  )
  const setIsCheckedPermission = usePermissionStore(
    state => state.setIsCheckedPermission,
  )

  const openPopup = () => {
    navigation.navigate('CustomModalScreen', {
      title: '권한 체크',
      contents: '필요권한이 없대ㅜ\n나 부르거나 앱 설정가서 권한 켜야해!!',
      okAction: openAppSettings,
    })
  }

  const notifeeReqeustPermissionIos = async () => {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (!enabled) {
      openPopup()
      setIsAgreeNotifee(false)
    }
    setIsCheckedPermission()
  }

  const notifeeReqeustPermissionAndroid = async () => {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    )

    if (result !== 'granted') {
      openPopup()
      setIsAgreeNotifee(false)
    }
    setIsCheckedPermission()
  }

  const requestPermission = useCallback(() => {
    if (isCheckedPermission) return
    requestMultiple(selectedPermission).then(statuses => {
      const key = findKeyByValueForRecord(statuses, 'granted', true)
      if (key?.length > 0) {
        openPopup()
      } else {
        if (Platform.OS === 'ios') {
          notifeeReqeustPermissionIos()
          return
        }
        notifeeReqeustPermissionAndroid()
      }
    })
  }, [])

  useEffect(() => {
    requestPermission()
  }, [])

  return <View />
})

export default PermissionController
