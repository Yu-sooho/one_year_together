import React, {memo, useEffect} from 'react'
import {
  useAppStateStore,
  useAuthStore,
  useEventStore,
  useLetterStore,
  usePermissionStore,
} from '../../stores'
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Platform, View} from 'react-native'
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import notifee, {AndroidImportance, EventType} from '@notifee/react-native'

type NotifeeListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackNavigatorParamList, 'NotifeeListScreen'>,
  CompositeNavigationProp<
    StackNavigationProp<NotifeeListScreenProps>,
    StackNavigationProp<LetterStackNavigatorParamList>
  >
>

const NotifeeController = memo(() => {
  const navigation = useNavigation<NotifeeListScreenNavigationProp>()
  const isAgreeNotifee = useAppStateStore(state => state.isAgreeNotifee)
  const isCheckedPermission = usePermissionStore(
    state => state.isCheckedPermission,
  )
  const addUsersSetting = useAuthStore(state => state.addUsersSetting)
  const setFcmToken = usePermissionStore(state => state.setFcmToken)

  const currentUser = useAuthStore(state => state.currentUser)
  const getLetter = useLetterStore(state => state.getLetter)
  const getEvent = useEventStore(state => state.getEvent)
  const showToast = useAppStateStore(state => state.showToast)

  async function createNotificationChannels() {
    await notifee.createChannel({
      id: 'tease',
      name: 'Tease Notifications',
      importance: AndroidImportance.HIGH,
    })

    await notifee.createChannel({
      id: 'event',
      name: 'Event Notifications',
      importance: AndroidImportance.HIGH,
    })

    await notifee.createChannel({
      id: 'letter',
      name: 'Letter Notifications',
      importance: AndroidImportance.HIGH,
    })
  }

  const showNotifee = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    // const id = remoteMessage.data?.id
    const type = remoteMessage.data?.type
    const title = remoteMessage.notification?.title
    const body = remoteMessage.notification?.body
    const groupId = `${type}`

    if (Platform.OS === 'android') {
      if (type === 'tease' || type === 'event' || type === 'letter') {
        await notifee.displayNotification({
          title: title,
          body: body,
          android: {
            channelId: type,
            groupId: groupId,
            groupSummary: true,
          },
        })
      }

      await notifee.displayNotification({
        title: title,
        body: body,
        android: {
          channelId: 'event',
        },
      })
      return
    }

    await notifee.displayNotification({
      title: title,
      body: body,
      ios: {
        categoryId: 'default',
        sound: 'default',
      },
    })
  }

  useEffect(() => {
    createNotificationChannels()

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      showNotifee(remoteMessage)
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
    const option: UserModel = {isPushNotifee: false, fcmToken: null}
    if (!!res) {
      option.isPushNotifee = isAgreeNotifee
      option.fcmToken = isAgreeNotifee ? res : null
    }
    await addUsersSetting(option)
  }

  useEffect(() => {
    uploadFcmToken()
  }, [isAgreeNotifee, isCheckedPermission])

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        touchEvent(remoteMessage)
      }
    })

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          touchEvent(remoteMessage)
        }
      })
  }, [])

  const touchEvent = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    const type = remoteMessage.data?.type
    const targetKey = remoteMessage.data?.targetKey

    if (typeof targetKey !== 'string' || !targetKey) {
      return
    }

    if (type === 'letter') {
      const result = await getLetter(targetKey)
      if (!result) {
        showToast('이미 삭제된건가봐!')
        return
      }
      const isLocked =
        result?.password &&
        !result?.isUnLockedUserId?.find(
          element => element === currentUser?.email,
        )
      if (!isLocked) {
        navigation.navigate('LetterScreen', {
          currentLetter: result,
        })
        return
      }
      navigation.navigate('PasswordScreen', {
        currentLetter: result,
      })
    }
    if (type === 'event') {
      const result = await getEvent(targetKey)
      if (!result) {
        showToast('이미 삭제된건가봐!')
        return
      }

      navigation.navigate('EventScreen', {
        event: result,
      })
    }
    if (type === 'tease') {
      navigation.navigate('LetterListScreen')
    }
  }

  notifee.onForegroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      const {notification} = detail
      if (notification && notification.data) {
        const {type, id, targetKey} = notification.data

        if (typeof targetKey !== 'string' || !targetKey) {
          return
        }

        if (type === 'letter') {
          const result = await getLetter(targetKey)
          if (!result) {
            showToast('이미 삭제된건가봐!')
            return
          }
          const isLocked =
            result?.password &&
            !result?.isUnLockedUserId?.find(
              element => element === currentUser?.email,
            )
          if (!isLocked) {
            navigation.navigate('LetterScreen', {
              currentLetter: result,
            })
            return
          }
          navigation.navigate('PasswordScreen', {
            currentLetter: result,
          })
        }
        if (type === 'event') {
          const result = await getEvent(targetKey)
          if (!result) {
            showToast('이미 삭제된건가봐!')
            return
          }

          navigation.navigate('EventScreen', {
            event: result,
          })
        }
        if (type === 'tease') {
          navigation.navigate('LetterListScreen')
        }
      }
    }
  })

  return <View />
})

export default NotifeeController
