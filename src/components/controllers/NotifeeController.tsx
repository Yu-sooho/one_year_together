import React, {memo, useCallback, useEffect} from 'react'
import {requestMultiple} from 'react-native-permissions'
import {usePermissionStore} from '../../stores'
import {findKeyByValueForRecord} from '../../utils'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {View} from 'react-native'
import messaging from '@react-native-firebase/messaging'

const NotifeeController = memo(() => {
  const navigation =
    useNavigation<StackNavigationProp<MainStackNavigatorParamList>>()
  const fcmToken = usePermissionStore(state => state.fcmToken)
  if (!fcmToken) return null
  return <View />
})

export default NotifeeController
