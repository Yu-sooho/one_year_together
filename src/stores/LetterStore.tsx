import {create} from 'zustand'
import useFirebaseStore from './FirebaseStore'
import {FirebaseDatabaseTypes} from '@react-native-firebase/database'

interface LetterState {
  letterList: LetterModel[]
  isDuringEvent: boolean
  currentLetter: LetterModel | null

  subscribeLetterList: () => void
  unsubscribeLetterList: () => void
  addLetter: (letter: LetterModel) => Promise<boolean>
  deleteLetter: (letter: LetterModel) => Promise<boolean>
  updateLetter: (
    letter: LetterModel,
    snapshot: FirebaseDatabaseTypes.DataSnapshot,
  ) => Promise<boolean>
  checkDuplicated: (
    title: string,
  ) => Promise<false | FirebaseDatabaseTypes.DataSnapshot>
  uploadLetterImage: (fileName: string, uri: string) => Promise<string | false>
}

const useLetterStore = create<LetterState>((set, get) => {
  const firebaseStore = useFirebaseStore.getState()

  return {
    letterList: [],
    isDuringEvent: false,
    currentLetter: null,
    subscribeLetterList: () => {
      return firebaseStore.subscribeRdb('/letters', list => {
        set({letterList: list})
      })
    },
    unsubscribeLetterList: () => {
      firebaseStore.unSubscribeRdb('/letters', get().subscribeLetterList)
    },
    checkDuplicated: async title => {
      const checkDuplicated = await firebaseStore.checkDuplicate(
        'letters',
        'title',
        title,
      )
      return checkDuplicated
    },
    addLetter: async letter => {
      const letterItem = {
        isUnLockedUserId: [],
        ...letter,
      }
      const result = await firebaseStore.addDataToRdb('/letters', letterItem)
      return result
    },
    deleteLetter: async letter => {
      const checkDuplicated = await get().checkDuplicated(letter.title)
      if (!checkDuplicated) return false
      let ref = ''

      checkDuplicated.forEach(childSnapshot => {
        const childKey = childSnapshot.key
        ref = `letters/${childKey}`
        return true
      })

      const result = await firebaseStore.deleteDataToRdb(ref)
      return result
    },
    updateLetter: async (letter, snapshot) => {
      const result = await firebaseStore.updateDataToRdb(
        '/letters',
        letter,
        snapshot,
      )
      return result
    },
    uploadLetterImage: async (fileName, uri) => {
      const result = await firebaseStore.uploadImage(`letters/${fileName}`, uri)
      return result
    },
  }
})

export default useLetterStore
