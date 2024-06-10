import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect} from 'react'
import {View, Text, Button} from 'react-native'
import {useEventStore} from '../stores'

type PhotoEventScreenNavigationProp = StackNavigationProp<
  PhotoEventStackNavigatorParamList,
  'PhotoEventScreen'
>
type PhotoEventScreenRouteProp = RouteProp<
  PhotoEventStackNavigatorParamList,
  'PhotoEventScreen'
>

type Props = {
  navigation: PhotoEventScreenNavigationProp
  route: PhotoEventScreenRouteProp
}

const PhotoEventScreen: React.FC<Props> = ({navigation, route}) => {
  const closeEvent = useEventStore(state => state.closeEvent)

  useEffect(() => {
    return () => {
      closeEvent()
    }
  }, [])

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>PhotoEventScreen</Text>
      <Button
        title="Go to Event List"
        onPress={() => navigation.navigate('MainStackNavigator')}
      />
    </View>
  )
}

export default PhotoEventScreen
