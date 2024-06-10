import {create} from 'zustand'

interface EventState {
  currentEvent: EventModel | null
  isDuringEvent: boolean

  openEvent: (event: EventModel) => void
  closeEvent: () => void
}

const useEventStore = create<EventState>((set, get) => ({
  currentEvent: null,
  isDuringEvent: false,

  openEvent: (event: EventModel) => {
    set({isDuringEvent: true, currentEvent: event})
  },
  closeEvent: () => {
    set({isDuringEvent: false, currentEvent: null})
  },
}))

export default useEventStore
