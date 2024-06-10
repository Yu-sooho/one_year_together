import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect} from 'react'
import {View, Text, Button} from 'react-native'
import {useEventStore} from '../stores'

type LetterScreenNavigationProp = StackNavigationProp<
  LetterStackNavigatorParamList,
  'LetterScreen'
>
type LetterScreenRouteProp = RouteProp<
  LetterStackNavigatorParamList,
  'LetterScreen'
>

type Props = {
  navigation: LetterScreenNavigationProp
  route: LetterScreenRouteProp
}

const LetterScreen: React.FC<Props> = ({navigation, route}) => {
  const closeEvent = useEventStore(state => state.closeEvent)

  useEffect(() => {
    return () => {
      closeEvent()
    }
  }, [])

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>LetterScreen</Text>
      <Button
        title="Go to Event List"
        onPress={() => navigation.navigate('MainStackNavigator')}
      />
    </View>
  )
}

export default LetterScreen
