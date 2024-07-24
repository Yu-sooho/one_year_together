import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import defaultStyles from '../styles'
import {useAuthStore, useFirebaseStore} from '../stores'
import auth from '@react-native-firebase/auth'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import FastImage from 'react-native-fast-image'
import {images} from '../resources'
import {normalize} from '../utils'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import fonts from '../styles/fonts'
import colors from '../styles/colors'
import {CustomBackgroundOpacity} from '../components'
import Balloon from 'react-native-balloon'

type LoginScreenNavigationProp = StackNavigationProp<
  LetterStackNavigatorParamList,
  'LoginScreen'
>

type LoginScreenRouteProp = RouteProp<
  LetterStackNavigatorParamList,
  'LoginScreen'
>

type Props = {
  navigation: LoginScreenNavigationProp
  route: LoginScreenRouteProp
}

const LoginScreen: React.FC<Props> = () => {
  const login = useAuthStore(state => state.login)
  const setCurrentUser = useAuthStore(state => state.setCurrentUser)
  const loginCheck = useFirebaseStore(state => state.loginCheck)
  const inset = useSafeAreaInsets()

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      )
      await auth().signInWithCredential(googleCredential)
      const isLogin = await loginCheck()
      if (!!isLogin) {
        setCurrentUser(isLogin)
        login()
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === statusCodes.SIGN_IN_CANCELLED) {
          console.log('User cancelled the login flow')
        } else if (error.message === statusCodes.IN_PROGRESS) {
          console.log('Sign in is in progress already')
        } else if (error.message === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log('Play services not available or outdated')
        } else {
          console.error(error)
        }
      } else {
        console.error('An unknown error occurred')
      }
    }
  }

  return (
    <View
      style={[
        defaultStyles.containerStyle,
        defaultStyles.centerContainerStyle,
      ]}>
      <FastImage
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height + inset.top,
        }}
        resizeMode={'cover'}
        source={images.login_image}
      />
      <CustomBackgroundOpacity />
      <View style={{position: 'absolute', top: normalize(160)}}>
        <Balloon
          borderColor={colors.cffffff}
          backgroundColor={colors.cffffff}
          borderWidth={1}
          borderRadius={10}
          triangleSize={10}
          width={normalize(200)}
          triangleOffset="45%"
          containerStyle={{
            padding: 10,
          }}>
          <Text
            style={{
              ...fonts.nanumgy24,
              fontSize: normalize(22),
              textAlign: 'center',
            }}>{`어서와!\n 기다리고 있었어!`}</Text>
        </Balloon>
      </View>
      <TouchableOpacity
        style={[
          styles.googleButton,
          {
            bottom: normalize(110) + inset.bottom,
            borderBottomColor: colors.cffffff,
            paddingHorizontal: normalize(4),
            borderBottomWidth: normalize(1),
            paddingBottom: 3,
          },
        ]}
        onPress={signInWithGoogle}>
        <Text
          style={{
            ...fonts.bmjua18,
            color: colors.cffffff,
          }}>
          구글로 로그인
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  googleButton: {
    position: 'absolute',
  },
  googleButtonImage: {
    width: normalize(240),
    height: normalize(54),
  },
})

export default LoginScreen
