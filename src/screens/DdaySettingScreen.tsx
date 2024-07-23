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
import {useAuthStore, useEventStore} from '../stores'
import {normalize} from '../utils'
import fonts from '../styles/fonts'

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
  const setDeletedDefaultEvent = useEventStore(
    state => state.setDeletedDefaultEvent,
  )

  const onPressPush = () => {
    setIsAgree(!isAgreePush)
  }

  const dataReset = () => {
    logout()
    setDeletedDefaultEvent(null)
  }

  const onPressLogout = () => {
    navigation.navigate('CustomModalScreen', {
      okAction: dataReset,
      title: '',
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
      <TouchableOpacity onPress={onPressLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logoutButton: {
    width: Dimensions.get('window').width,
    height: normalize(60),
    paddingHorizontal: normalize(20),
    marginTop: normalize(24),
  },
  logoutText: {
    ...fonts.bmjua16,
  },
})

export default DdaySettingScreen
