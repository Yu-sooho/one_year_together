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
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {CustomHeader, CustomRadioButton} from '../components'
import defaultStyles from '../styles'
import {useAuthStore} from '../stores'
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

  const onPressPush = () => {
    setIsAgree(!isAgreePush)
  }

  const onPressLogout = () => {
    navigation.navigate('CustomModalScreen', {
      okAction: logout,
      title: '',
    })
  }

  return (
    <SafeAreaView style={defaultStyles.containerStyle}>
      <CustomHeader title="DdaySettingScreen" />
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
    marginTop: normalize(120),
  },
  logoutText: {
    ...fonts.bmjua16,
  },
})

export default DdaySettingScreen
