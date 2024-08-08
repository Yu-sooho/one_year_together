import React, {memo, useCallback, useEffect} from 'react'
import {requestMultiple} from 'react-native-permissions'
import {useAppStateStore, usePermissionStore} from '../../stores'
import {findKeyByValueForRecord} from '../../utils'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Alert, PermissionsAndroid, Platform, View} from 'react-native'
import messaging from '@react-native-firebase/messaging'

const NotifeeController = memo(() => {
  const navigation =
    useNavigation<StackNavigationProp<MainStackNavigatorParamList>>()
  const isAgreeNotifee = useAppStateStore(state => state.isAgreeNotifee)
  const addSetting = useAppStateStore(state => state.addSetting)
  const settingData = useAppStateStore(state => state.settingData)
  const fcmToken = usePermissionStore(state => state.fcmToken)
  const setFcmToken = usePermissionStore(state => state.setFcmToken)
  const isCheckedPermission = usePermissionStore(
    state => state.isCheckedPermission,
  )

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
    })

    return unsubscribe
  }, [])

  const getFcm = async () => {
    try {
      const token = await messaging().getToken()
      setFcmToken(token)
      return token
    } catch (error) {
      console.log('getFcm error', error)
      return false
    }
  }

  const uploadFcmToken = async () => {
    if (!isCheckedPermission) return
    const res = await getFcm()
    const option: SettingModel = {isPushNotifee: false, fcmToken: null}
    if (!!res) {
      option.isPushNotifee = isAgreeNotifee
      option.fcmToken = isAgreeNotifee ? res : null
    }
    await addSetting(option)
  }

  useEffect(() => {
    uploadFcmToken()
  }, [isAgreeNotifee, isCheckedPermission])

  return <View />
})

export default NotifeeController
