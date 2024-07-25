import {CompositeNavigationProp, RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'
import {View, Text, StyleSheet, SafeAreaView} from 'react-native'
import defaultStyles from '../styles'
import {useAppStateStore, useAuthStore, useLetterStore} from '../stores'
import {CustomBottomButton, CustomHeader, CustomTextInput} from '../components'
import fonts from '../styles/fonts'
import {normalize} from '../utils'

type PasswordScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackNavigatorParamList, 'LetterListScreen'>,
  StackNavigationProp<LetterStackNavigatorParamList>
>

type PasswordScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'PasswordScreen'
>

type Props = {
  navigation: PasswordScreenNavigationProp
  route: PasswordScreenRouteProp
}

const PasswordScreen: React.FC<Props> = ({navigation, route}) => {
  const {
    hint = '힌트',
    password,
    title,
    isUnLockedUserId,
  } = route.params.currentLetter

  const currentUser = useAuthStore(state => state.currentUser)
  const showToast = useAppStateStore(state => state.showToast)
  const checkDuplicate = useLetterStore(state => state.checkDuplicated)
  const updateLetter = useLetterStore(state => state.updateLetter)

  const [text, setText] = useState('')
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const onChangeText = (value: string) => {
    setText(value)
    setIsError(false)
    setErrorMessage('')
  }

  const onPressComlete = async () => {
    if (password === text) {
      const checkDuplicated = await checkDuplicate(title)
      if (!checkDuplicated) {
        return
      }
      const userList = []

      if (isUnLockedUserId) {
        userList.push(...isUnLockedUserId)
      }

      if (currentUser?.email) {
        userList.push(currentUser?.email)
      }

      const letter: LetterModel = {
        ...route.params.currentLetter,
        isUnLockedUserId: userList,
      }
      const result = await updateLetter(letter, checkDuplicated)
      if (result) {
        navigation.goBack()
        navigation.navigate('LetterScreen', {
          currentLetter: letter,
        })
        return
      }
      showToast('서버에러 인가봐 ㅜ')
      return
    }
    setIsError(true)
    setErrorMessage('   ')
    showToast('', 'error')
  }

  return (
    <SafeAreaView style={[defaultStyles.containerStyle]}>
      <CustomHeader title={''} />
      <View style={styles.container}>
        <Text
          style={{
            ...fonts.bmjua16,
            paddingHorizontal: normalize(20),
            marginBottom: normalize(20),
          }}>{`힌트: ${hint}`}</Text>
        <CustomTextInput
          isError={isError}
          placeholder={'여기에 비밀번호를 치면되요!'}
          style={styles.textInputStyle}
          onChangeText={onChangeText}
          value={text}
          errorMessage={errorMessage}
        />
      </View>
      <CustomBottomButton onPressButton={onPressComlete} buttonText="완료" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  textInputStyle: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default PasswordScreen
