import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {View, Text, Button, TouchableOpacity} from 'react-native'
import defaultStyles from '../styles'
import {SafeAreaView} from 'react-native-safe-area-context'
import {CustomHeader} from '../components'

type LetterListScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'LetterListScreen'
>
type LetterListScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'LetterListScreen'
>

type Props = {
  navigation: LetterListScreenNavigationProp
  route: LetterListScreenRouteProp
}

const LetterListScreen: React.FC<Props> = ({navigation, route}) => {
  const navigatedEditLetterScreen = () => {
    navigation.navigate('EditLetterScreen')
  }

  return (
    <SafeAreaView style={defaultStyles.containerStyle}>
      <CustomHeader title="LetterListScreen" />
      <View style={defaultStyles.centerContainerStyle}>
        <Text>LetterListScreen</Text>
      </View>
      <TouchableOpacity onPress={navigatedEditLetterScreen}>
        <Text>123</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default LetterListScreen
