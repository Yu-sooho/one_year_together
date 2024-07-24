import {create, StateCreator} from 'zustand'
import useFirebaseStore from './FirebaseStore'
import {FirebaseDatabaseTypes} from '@react-native-firebase/database'
import moment from 'moment'
import {createJSONStorage, persist, PersistOptions} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
  uploadEventImage: (
    title: string,
    fileName: string,
    uri: string,
  ) => Promise<string | false>
  deletedDefaultEvent: EventModel[]
  setDeletedDefaultEvent: (item: EventModel | null) => void
}

interface persistOption {
  deletedDefaultEvent: EventModel[]
}

type MyPersist = (
  config: StateCreator<EventState>,
  options: PersistOptions<EventState, persistOption>,
) => StateCreator<EventState>

const useEventStore = create<EventState>()(
  (persist as MyPersist)(
    (set, get) => {
      const firebaseStore = useFirebaseStore.getState()

      return {
        eventList: [],
        subscribeEventList: () => {
          return firebaseStore.subscribeRdb('/events', list => {
            const tempList: EventModel[] = []
            list.forEach(element => {
              if (moment(element.targetAt).isBefore(moment())) {
                tempList.push({
                  ...element,
                  targetAt: element.targetAt,
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
        uploadEventImage: async (title, fileName, uri) => {
          const result = await firebaseStore.uploadImage(
            `events/${title}/${fileName}`,
            uri,
          )
          return result
        },
        deletedDefaultEvent: [],
        setDeletedDefaultEvent: (item: EventModel | null) => {
          const deletedDefaultEvent = get().deletedDefaultEvent
          if (!item) {
            set({deletedDefaultEvent: []})
          } else {
            set({deletedDefaultEvent: [...deletedDefaultEvent, item]})
          }
        },
      }
    },
    {
      name: 'event-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({deletedDefaultEvent: state.deletedDefaultEvent}),
      onRehydrateStorage: () => state => {
        console.log('State rehydrated', state)
      },
    },
  ),
)

export default useEventStore
