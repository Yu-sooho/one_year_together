import {CompositeNavigationProp, RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useCallback, useState} from 'react'
import {
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {CustomHeader, CustomRadioButton} from '../components'
import colors from '../styles/colors'
import {useAppStateStore, useNotifeeStore, usePermissionStore} from '../stores'
import messaging from '@react-native-firebase/messaging'
import Icon from 'react-native-vector-icons/Feather'
import {normalize} from '../utils'
import fonts from '../styles/fonts'
import {NotifeeListItem} from '../components/items'

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
  const notifeeData = useNotifeeStore(state => state.notifeeData)
  const updateNotifee = useNotifeeStore(state => state.updateNotifee)
  const checkDuplicate = useNotifeeStore(state => state.checkDuplicated)

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

  const [checkItem, setCheckItem] = useState<NotifeeModel[]>([])

  const onPressItem = useCallback(async (item: NotifeeModel) => {
    const checkDuplicated = await checkDuplicate(item.key)
    if (!checkDuplicated) return
    if (!item?.isRead) {
      const option: NotifeeModel = {
        ...item,
        isRead: true,
      }
      await updateNotifee(option, checkDuplicated)
    }
  }, [])

  const onPressDeleteItem = useCallback((item: NotifeeModel) => {
    const findIndex = checkItem.findIndex(element => element === item)
    const temp = checkItem
    if (findIndex < 0) {
      temp.push(item)
      setCheckItem([...temp])
    } else {
      temp.splice(findIndex, 1)
      setCheckItem([...temp])
    }
  }, [])

  const renderItem = useCallback(
    ({item, index}: {item: NotifeeModel; index: number}) => {
      return (
        <NotifeeListItem
          item={item}
          index={index}
          isChecked={!!checkItem.find(element => element === item)}
          onPressItem={onPressItem}
          onPressDeleteItem={onPressDeleteItem}
        />
      )
    },
    [checkItem],
  )

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
      <FlatList data={notifeeData} renderItem={renderItem} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cffffff,
  },
  listItemContainer: {
    height: normalize(80),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
  },
})

export default NotifeeListScreen
