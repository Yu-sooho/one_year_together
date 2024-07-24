import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {CustomHeader, CustomRadioButton} from '../components'
import defaultStyles from '../styles'
import {
  useAppStateStore,
  useAuthStore,
  useEventStore,
  usePermissionStore,
} from '../stores'
import {getFileExtension, normalize} from '../utils'
import Icon from 'react-native-vector-icons/Feather'
import fonts from '../styles/fonts'
import colors from '../styles/colors'
import ImageCropPicker, {ImageOrVideo} from 'react-native-image-crop-picker'

type DdaySettingScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'DdaySettingScreen'
>
type DdaySettingScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'DdaySettingScreen'
>

type Props = {
  navigation: DdaySettingScreenNavigationProp
  route: DdaySettingScreenRouteProp
}

const DdaySettingScreen: React.FC<Props> = ({navigation, route}) => {
  const [isAgreePush, setIsAgree] = useState(false)
  const logout = useAuthStore(state => state.logout)

  const setWidgetImageUrl = useAppStateStore(state => state.setWidgetImageUrl)
  const setHomeImageUrl = useAppStateStore(state => state.setHomeImageUrl)
  const showToast = useAppStateStore(state => state.showToast)
  const addSetting = useAppStateStore(state => state.addSetting)
  const setIsLoading = useAppStateStore(state => state.setIsLoading)
  const settingData = useAppStateStore(state => state.settingData)

  const checkPermission = usePermissionStore(state => state.checkPermission)
  const openPermissionModal = usePermissionStore(
    state => state.openPermissionModal,
  )

  // const changedWidgetImage = async () => {
  //   const result: ImageOrVideo | false = await openPicker()
  //   if (!result) {
  //     showToast('설정할 수 없는 이미지야 ㅠ')
  //     return
  //   }
  //   setWidgetImageUrl({widgetImagePath: result.path})
  // }

  const openPicker: () => Promise<false | ImageOrVideo> = async () => {
    const isHaveNoPermission = await checkPermission()
    if (isHaveNoPermission?.length > 0) {
      openPermissionModal(navigation)
      return false
    }
    try {
      const result = await ImageCropPicker.openPicker({
        cropping: true,
        multiple: false,
        freeStyleCropEnabled: true,
      })
      return result
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const updateSetting = async (path?: string) => {
    await addSetting({
      isPushNotifee: isAgreePush,
      homeImageUrl: path || settingData?.homeImageUrl,
    })
    setIsLoading()
  }

  const changedHomeImage = async () => {
    setIsLoading()
    const result: ImageOrVideo | false = await openPicker()
    if (!result) {
      setIsLoading()
      showToast('설정할 수 없는 이미지야 ㅠ')
      return
    }
    const imageUrl = await setHomeImageUrl({homeImagePath: result.path})
    if (typeof imageUrl === 'string') {
      updateSetting(imageUrl)
    }
  }
  const setDeletedDefaultEvent = useEventStore(
    state => state.setDeletedDefaultEvent,
  )

  const onPressPush = () => {
    setIsAgree(!isAgreePush)
    setIsLoading()
    updateSetting()
  }

  const dataReset = () => {
    logout()
    setDeletedDefaultEvent(null)
  }

  const onPressLogout = () => {
    navigation.navigate('CustomModalScreen', {
      okAction: dataReset,
      title: '로그아웃 할거야?',
      contents: '하지마요 ㅜ',
    })
  }

  const homeImageReset = async () => {
    setIsLoading()
    await setHomeImageUrl({homeImagePath: null})
    setIsLoading()
  }

  const onPressInitHomeImage = () => {
    navigation.navigate('CustomModalScreen', {
      okAction: homeImageReset,
      title: '홈 이미지 삭제',
      contents: '기본으로 돌아갈거야!',
    })
  }

  return (
    <SafeAreaView style={defaultStyles.containerStyle}>
      <StatusBar barStyle="dark-content" />
      <CustomHeader title="" />
      <CustomRadioButton
        onPress={onPressPush}
        text={'푸시 알림 허용'}
        value={isAgreePush}
      />

      <TouchableOpacity onPress={changedHomeImage} style={styles.button}>
        <Text style={styles.buttonText}>홈 이미지 설정</Text>
        {settingData?.homeImageUrl && (
          <TouchableOpacity
            onPress={onPressInitHomeImage}
            style={styles.xButton}>
            <Icon name="x" size={normalize(22)} color={colors.c242424} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={changedWidgetImage} style={styles.button}>
        <Text style={styles.buttonText}>위젯 이미지 설정</Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={onPressLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  button: {
    width: Dimensions.get('window').width,
    height: normalize(44),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  xButton: {
    height: normalize(44),
    width: normalize(44),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonText: {
    ...fonts.bmjua16,
  },
  logoutButton: {
    width: Dimensions.get('window').width,
    height: normalize(60),
    paddingHorizontal: normalize(20),
    justifyContent: 'center',
    marginTop: normalize(24),
  },
  logoutText: {
    ...fonts.bmjua14,
    color: colors.cd4d4d4,
  },
})

export default DdaySettingScreen
