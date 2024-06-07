import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {View, Text, Button} from 'react-native'

type EditEventScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'EditEventScreen'
>
type EditEventScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'EditEventScreen'
>

type Props = {
  navigation: EditEventScreenNavigationProp
  route: EditEventScreenRouteProp
}

const EditEventScreen: React.FC<Props> = ({navigation, route}) => {
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

export default EditEventScreen
