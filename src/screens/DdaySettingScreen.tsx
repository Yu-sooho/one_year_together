import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {View, Text, Button} from 'react-native'

type DdaySettingScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'DdaySettingScreen'
>
type DdaySettingScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'DdaySettingScreen'
>

type Props = {
  navigation: DdaySettingScreenNavigationProp
  route: DdaySettingScreenRouteProp
}

const DdaySettingScreen: React.FC<Props> = ({navigation, route}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>DdaySettingScreen</Text>
      <Button
        title="Go to Event List"
        onPress={() => navigation.navigate('DdaySettingScreen')}
      />
    </View>
  )
}

export default DdaySettingScreen
