// screens/HomeScreen.js
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {View, Text, Button} from 'react-native'

type EventScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'EventScreen'
>
type EventScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'EventScreen'
>

type Props = {
  navigation: EventScreenNavigationProp
  route: EventScreenRouteProp
}

const EventScreen: React.FC<Props> = ({navigation, route}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Event List"
        onPress={() => navigation.navigate('DdaySettingScreen')}
      />
    </View>
  )
}

export default EventScreen
