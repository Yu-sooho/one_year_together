import {create} from 'zustand'
import useFirebaseStore from './FirebaseStore'

interface EventState {
  eventList: EventModel[]
  subscribeEventList: () => void
  unsubscribeEventList: () => void
}
const useEventStore = create<EventState>((set, get) => {
  const firebaseStore = useFirebaseStore.getState()

  return {
    eventList: [],
    subscribeEventList: () => {
      return firebaseStore.subscribeRdb('/events', list => {
        set({eventList: list})
      })
    },
    unsubscribeEventList: () => {
      firebaseStore.unSubscribeRdb('/events', get().subscribeEventList)
    },
  }
})

export default useEventStore
