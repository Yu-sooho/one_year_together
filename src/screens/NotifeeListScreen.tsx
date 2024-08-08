import {CompositeNavigationProp, RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useCallback} from 'react'
import {
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {CustomHeader, CustomRadioButton} from '../components'
import colors from '../styles/colors'
import {useAppStateStore, useAuthStore, usePermissionStore} from '../stores'
import messaging from '@react-native-firebase/messaging'

type NotifeeListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackNavigatorParamList, 'LetterListScreen'>,
  StackNavigationProp<NotifeeListScreenProps>
>

type NotifeeListScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'NotifeeListScreen'
>

type Props = {
  navigation: NotifeeListScreenNavigationProp
  route: NotifeeListScreenRouteProp
}

const NotifeeListScreen: React.FC<Props> = ({navigation, route}) => {
  const isAgreeNotifee = useAppStateStore(state => state.isAgreeNotifee)
  const setIsAgreeNotifee = useAppStateStore(state => state.setIsAgreeNotifee)
  const openAppSettings = usePermissionStore(state => state.openAppSettings)

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

    if (enabled) {
      setIsAgreeNotifee(!isAgreeNotifee)
    } else {
      setIsAgreeNotifee(false)
      openPopup()
    }
  }

  const notifeeReqeustPermissionAndroid = async () => {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    )
    if (result === 'granted') {
      setIsAgreeNotifee(!isAgreeNotifee)
      return
    }
    setIsAgreeNotifee(false)
    openPopup()
  }

  const renderItem = useCallback(() => {
    return (
      <View>
        <Text>123</Text>
      </View>
    )
  }, [])

  const onPressPush = () => {
    if (Platform.OS === 'ios') {
      notifeeReqeustPermissionIos()
      return
    }
    notifeeReqeustPermissionAndroid()
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="알림" />
      <CustomRadioButton
        onPress={onPressPush}
        text={'푸시 알림 허용'}
        value={isAgreeNotifee}
      />
      <FlatList data={[]} renderItem={renderItem} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cffffff,
  },
})

export default NotifeeListScreen
