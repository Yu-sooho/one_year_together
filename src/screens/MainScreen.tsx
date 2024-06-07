import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {View, Text, Button} from 'react-native'
import {CustomHeader} from '../components'
import defaultStyles from '../styles'
import {SafeAreaView} from 'react-native-safe-area-context'

type MainScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'MainScreen'
>
type MainScreenRouteProp = RouteProp<MainStackNavigatorParamList, 'MainScreen'>

type Props = {
  navigation: MainScreenNavigationProp
  route: MainScreenRouteProp
}

const MainScreen: React.FC<Props> = ({navigation, route}) => {
  return (
    <SafeAreaView style={defaultStyles.containerStyle}>
      <CustomHeader title="하하" />
      <View style={defaultStyles.containerStyle}>
        <Text>MainScreen</Text>
        <Button
          title="Go to Event List"
          onPress={() => navigation.navigate('EditEventScreen')}
        />
      </View>
    </SafeAreaView>
  )
}

export default MainScreen
