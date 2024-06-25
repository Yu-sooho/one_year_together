import {create} from 'zustand'
import useFirebaseStore from './FirebaseStore'
import {FirebaseDatabaseTypes} from '@react-native-firebase/database'
import moment from 'moment'
import {daysUntilYear} from '../utils'

interface EventState {
  eventList: EventModel[]
  subscribeEventList: () => void
  unsubscribeEventList: () => void
  addEvent: (event: EventModel) => Promise<boolean>
  deleteEvent: (event: EventModel) => Promise<boolean>
  updateEvent: (
    event: EventModel,
    snapshot: FirebaseDatabaseTypes.DataSnapshot,
  ) => Promise<boolean>
  checkDuplicated: (
    title: string,
  ) => Promise<false | FirebaseDatabaseTypes.DataSnapshot>
  uploadEventImage: (fileName: string, uri: string) => Promise<string | false>
}
const useEventStore = create<EventState>((set, get) => {
  const firebaseStore = useFirebaseStore.getState()

  return {
    eventList: [],
    subscribeEventList: () => {
      return firebaseStore.subscribeRdb('/events', list => {
        const tempList: EventModel[] = []
        list.forEach(element => {
          if (moment(element.targetAt) < moment()) {
            tempList.push({
              ...element,
              targetAt: daysUntilYear(element.targetAt),
            })
          } else {
            tempList.push(element)
          }
        })
        set({eventList: tempList})
      })
    },
    unsubscribeEventList: () => {
      firebaseStore.unSubscribeRdb('/events', get().subscribeEventList)
    },
    checkDuplicated: async title => {
      const checkDuplicated = await firebaseStore.checkDuplicate(
        'events',
        'title',
        title,
      )
      return checkDuplicated
    },
    addEvent: async event => {
      const result = await firebaseStore.addDataToRdb('/events', event)
      return result
    },
    deleteEvent: async event => {
      const checkDuplicated = await get().checkDuplicated(event.title)
      if (!checkDuplicated) return false
      let ref = ''

      checkDuplicated.forEach(childSnapshot => {
        const childKey = childSnapshot.key
        ref = `events/${childKey}`
        return true
      })

      const result = await firebaseStore.deleteDataToRdb(ref)
      return result
    },
    updateEvent: async (event, snapshot) => {
      const result = await firebaseStore.updateDataToRdb(
        '/events',
        event,
        snapshot,
      )
      return result
    },
    uploadEventImage: async (fileName, uri) => {
      const result = await firebaseStore.uploadImage(`events/${fileName}`, uri)
      return result
    },
  }
})

export default useEventStore
