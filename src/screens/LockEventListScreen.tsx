import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {View, Text, Button} from 'react-native'

type LockEventListScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'LockEventListScreen'
>
type LockEventListScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'LockEventListScreen'
>

type Props = {
  navigation: LockEventListScreenNavigationProp
  route: LockEventListScreenRouteProp
}

const LockEventListScreen: React.FC<Props> = ({navigation, route}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>LockEventListScreen</Text>
      <Button
        title="Go to Event List"
        onPress={() => navigation.navigate('DdaySettingScreen')}
      />
    </View>
  )
}

export default LockEventListScreen
