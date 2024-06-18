import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {View, Text, Button} from 'react-native'
import defaultStyles from '../styles'
import {useAuthStore, useEventStore, useFirebaseStore} from '../stores'
import auth from '@react-native-firebase/auth'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'

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

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      )
      await auth().signInWithCredential(googleCredential)
      console.log('User signed in with Google')
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
      <Text>LoginScreen</Text>
      <Button title="Go to Event List" onPress={signInWithGoogle} />
    </View>
  )
}

export default LoginScreen
