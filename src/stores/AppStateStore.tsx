import {EdgeInsets} from 'react-native-safe-area-context'
import {create} from 'zustand'

interface AppState {}

const useAppStateStore = create<AppState>((set, get) => ({}))

export default useAppStateStore
