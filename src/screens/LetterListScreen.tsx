import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {View, Text, Button} from 'react-native'

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
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>LetterListScreen</Text>
      <Button
        title="Go to Event List"
        onPress={() => navigation.navigate('EditLetterScreen')}
      />
    </View>
  )
}

export default LetterListScreen
