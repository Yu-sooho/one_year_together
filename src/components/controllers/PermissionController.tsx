import React, {memo, useCallback, useEffect} from 'react'
import {requestMultiple} from 'react-native-permissions'
import {usePermissionStore} from '../../stores'
import {findKeyByValueForRecord} from '../../utils'
import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {View} from 'react-native'

const PermissionController = memo(() => {
  const navigation =
    useNavigation<StackNavigationProp<MainStackNavigatorParamList>>()
  const selectedPermission = usePermissionStore(
    state => state.selectedPermission,
  )

  const openAppSettings = usePermissionStore(state => state.openAppSettings)

  const openPopup = () => {
    navigation.navigate('CustomModalScreen', {
      title: '권한 체크',
      contents: '필요한 권한이 없습니다',
      okAction: openAppSettings,
    })
  }

  const requestPermission = useCallback(() => {
    requestMultiple(selectedPermission).then(statuses => {
      const key = findKeyByValueForRecord(statuses, 'granted', true)
      if (key?.length > 0) {
        openPopup()
      }
    })
  }, [])

  useEffect(() => {
    requestPermission()
  }, [])

  return <View />
})

export default PermissionController
