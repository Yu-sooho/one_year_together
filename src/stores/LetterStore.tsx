import {create} from 'zustand'
import useFirebaseStore from './FirebaseStore'

interface LetterState {
  letterList: any[]

  subscribeLetterList: () => void
  unsubscribeLetterList: () => void
  addLetter: (letter: LetterModel) => Promise<boolean>
  checkDuplicated: (title: string) => Promise<boolean>
  uploadLetterImage: (fileName: string, uri: string) => Promise<string | false>
}

const useLetterStore = create<LetterState>((set, get) => {
  const firebaseStore = useFirebaseStore.getState()

  return {
    letterList: [],
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
      const result = await firebaseStore.addDataToRdb('/letters', letter)
      return result
    },
    uploadLetterImage: async (fileName, uri) => {
      const result = await firebaseStore.uploadImage(`letters/${fileName}`, uri)
      return result
    },
  }
})

export default useLetterStore
