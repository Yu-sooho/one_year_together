import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect} from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'
import {useEventStore} from '../stores'
import FastImage from 'react-native-fast-image'
import {CustomBackgroundOpacity} from '../components'

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
    <View style={styles.container}>
      <FastImage
        style={styles.image}
        source={{
          uri: 'https://helpx.adobe.com/content/dam/help/en/photoshop/using/quick-actions/remove-background-before-qa1.png',
        }}></FastImage>
      <CustomBackgroundOpacity>
        <Text>LetterScreen</Text>
        <Button
          title="Go to Event List"
          onPress={() => navigation.navigate('MainStackNavigator')}
        />
      </CustomBackgroundOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
})

export default LetterScreen
