import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {View, Text, FlatList, StyleSheet, Button, TextInput} from 'react-native'
import defaultStyles from '../styles'
import {SafeAreaView} from 'react-native-safe-area-context'
import {CustomBottomButton, CustomHeader} from '../components'
import database from '@react-native-firebase/database'

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

  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState('')

  useEffect(() => {
    const onValueChange = database()
      .ref('/events')
      .on('value', snapshot => {
        const eventList: Event[] = []
        snapshot.forEach(childSnapshot => {
          const event = {
            key: childSnapshot.key,
            title: childSnapshot.val().title,
            createdAt: childSnapshot.val().createdAt,
          }
          eventList.push(event)
          return undefined
        })
        console.log('Event List:', eventList) // 로그 추가
        setEvents(eventList)
      })

    // Unsubscribe from events when no longer in use
    return () => database().ref('/events').off('value', onValueChange)
  }, [])

  const addEvent = () => {
    if (newEvent.trim() === '') return
    const newEventRef = database().ref('/events').push()
    newEventRef.set({
      title: newEvent,
      createdAt: database.ServerValue.TIMESTAMP,
    })
    setNewEvent('')
  }

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
      <Button title="Add Event" onPress={addEvent} />
      <FlatList
        data={events}
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

export default LetterListScreen
