import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {View, Text, FlatList, StyleSheet, Button, TextInput} from 'react-native'
import defaultStyles from '../styles'
import {SafeAreaView} from 'react-native-safe-area-context'
import {CustomBottomButton, CustomHeader} from '../components'
import database from '@react-native-firebase/database'
import {useFirebaseStore, useLetterStore} from '../stores'

type MainStackNavigatorParamList = {
  LetterListScreen: undefined
  EditLetterScreen: undefined
}

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

type Event = {
  key: string | null
  title: string
  createdAt: number
}

const LetterListScreen: React.FC<Props> = ({navigation, route}) => {
  const navigatedEditLetterScreen = () => {
    navigation.navigate('EditLetterScreen')
  }

  const [newEvent, setNewEvent] = useState('')
  const subscribeLetterList = useLetterStore(state => state.subscribeLetterList)
  const unsubscribeLetterList = useLetterStore(
    state => state.unsubscribeLetterList,
  )
  const letterList = useLetterStore(state => state.letterList)

  useEffect(() => {
    subscribeLetterList()
    return () => unsubscribeLetterList()
  }, [])

  return (
    <SafeAreaView style={defaultStyles.containerStyle}>
      <CustomHeader title="LetterListScreen" />
      <View style={defaultStyles.containerStyle}>
        <Text style={styles.title}>Letter List</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="New Event"
        value={newEvent}
        onChangeText={setNewEvent}
      />
      <FlatList
        data={letterList}
        renderItem={({item}) => (
          <View style={styles.eventItem}>
            <Text>{item.title}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
        keyExtractor={item => item.key}
      />
      <CustomBottomButton
        buttonText={'확인'}
        onPressButton={navigatedEditLetterScreen}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  eventItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
})

export default React.memo(LetterListScreen)
