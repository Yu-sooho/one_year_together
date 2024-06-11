import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {View, Text, Button} from 'react-native'
import {CustomBottomTabBar, CustomHeader} from '../components'
import defaultStyles from '../styles'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useAuthStore} from '../stores'

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
  const logout = useAuthStore(state => state.logout)

  return (
    <SafeAreaView edges={['top']} style={defaultStyles.containerStyle}>
      <View style={defaultStyles.containerStyle}></View>
      <CustomBottomTabBar />
    </SafeAreaView>
  )
}

export default MainScreen
