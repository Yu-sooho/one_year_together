import {CompositeNavigationProp, RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useCallback, useEffect, useState} from 'react'
import {
  Dimensions,
  FlatList,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context'
import {CustomBottomButton, CustomHeader} from '../components'
import colors from '../styles/colors'
import {
  useAppStateStore,
  useAuthStore,
  useEventStore,
  useLetterStore,
  useNotifeeStore,
  usePermissionStore,
} from '../stores'
import messaging from '@react-native-firebase/messaging'
import Icon from 'react-native-vector-icons/Feather'
import {normalize} from '../utils'
import fonts from '../styles/fonts'
import {NotifeeListItem} from '../components/items'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type NotifeeListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackNavigatorParamList, 'NotifeeListScreen'>,
  CompositeNavigationProp<
    StackNavigationProp<NotifeeListScreenProps>,
    StackNavigationProp<LetterStackNavigatorParamList>
  >
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
  const inset = useSafeAreaInsets()
  const setIsLoading = useAppStateStore(state => state.setIsLoading)
  const notifeeData = useNotifeeStore(state => state.notifeeData)
  const getLetter = useLetterStore(state => state.getLetter)
  const getEvent = useEventStore(state => state.getEvent)
  const updateNotifee = useNotifeeStore(state => state.updateNotifee)
  const checkDuplicate = useNotifeeStore(state => state.checkDuplicated)
  const deleteNotifee = useNotifeeStore(state => state.deleteNotifee)
  const currentUser = useAuthStore(state => state.currentUser)
  const showToast = useAppStateStore(state => state.showToast)

  const [checkItem, setCheckItem] = useState<NotifeeModel[]>([])

  const onPressItem = useCallback(async (item: NotifeeModel) => {
    if (item?.type === 'letter') {
      const result = await getLetter(item?.targetKey)
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
    if (item?.type === 'event') {
      const result = await getEvent(item?.targetKey)
      if (!result) {
        showToast('이미 삭제된건가봐!')
        return
      }

      navigation.navigate('EventScreen', {
        event: result,
      })
    }
    if (item?.type === 'tease') {
      navigation.navigate('LetterListScreen')
    }
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

  const deleteAll = async () => {
    if (!notifeeData) return
    setIsLoading()
    const res = await deleteNotifee(notifeeData)
    setIsLoading()
    setCheckItem([])
  }

  const deleteCheck = async () => {
    if (!checkItem) return
    setIsLoading()
    const res = await deleteNotifee(checkItem)
    setIsLoading()
    setCheckItem([])
  }

  const onPressDelete = () => {
    navigation.navigate('CustomModalScreen', {
      okAction: () => deleteAll(),
      title: '전부 삭제될거야',
      contents: '다 읽었지?',
    })
  }

  const onPressDeleteCheck = () => {
    navigation.navigate('CustomModalScreen', {
      okAction: () => deleteCheck(),
      title: '체크한 것만 삭제될거야',
      contents: '다 읽었지?',
    })
  }

  const deleteButtonAnimatedValue = useSharedValue(0)

  const bottomButtonSize = normalize(50) + normalize(20) + inset.bottom

  useEffect(() => {
    if (checkItem?.length > 0) {
      deleteButtonAnimatedValue.value = withTiming(-bottomButtonSize, {
        duration: 250,
      })
    } else {
      deleteButtonAnimatedValue.value = withTiming(0, {
        duration: 250,
      })
    }
  }, [checkItem])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: deleteButtonAnimatedValue.value,
        },
      ],
    }
  })

  const DeleteAllButton = () => {
    return (
      <TouchableOpacity onPress={onPressDelete}>
        <Icon name="trash" size={normalize(22)} color={colors.c242424} />
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="알림" rightContent={<DeleteAllButton />} />
      <FlatList
        data={notifeeData}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            bottom: -bottomButtonSize,
            width: Dimensions.get('window').width,
            height: normalize(50) + inset.bottom + normalize(20),
            paddingBottom: normalize(20),
          },
        ]}>
        <CustomBottomButton
          onPressButton={onPressDeleteCheck}
          isDisabled={checkItem?.length <= 0}
          buttonText="삭제"
        />
      </Animated.View>
    </SafeAreaView>
  )
}

const ListEmptyComponent = () => {
  return (
    <View style={styles.listEmptyContainer}>
      <Text style={styles.listEmptyText}>리스트가 없어용</Text>
    </View>
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
  listEmptyContainer: {
    paddingTop: normalize(120),
    alignItems: 'center',
  },
  listEmptyText: {
    ...fonts.bmjua14,
    color: colors.cbfbfbf,
  },
})

export default NotifeeListScreen
