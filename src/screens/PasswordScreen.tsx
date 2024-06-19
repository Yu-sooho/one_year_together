import {CompositeNavigationProp, RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'
import {View, Text, StyleSheet, SafeAreaView} from 'react-native'
import defaultStyles from '../styles'
import {useAppStateStore, useAuthStore, useLetterStore} from '../stores'
import {CustomBottomButton, CustomHeader, CustomTextInput} from '../components'

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
      showToast('실패했습니다.')
      return
    }
    setIsError(true)
    setErrorMessage('잘못된 패스워드 입니다.')
  }

  return (
    <SafeAreaView style={[defaultStyles.containerStyle]}>
      <CustomHeader title={'PasswordScreen'} />
      <View style={styles.container}>
        <Text>{hint}</Text>
        <CustomTextInput
          isError={isError}
          placeholder={'입력'}
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
