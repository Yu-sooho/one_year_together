import {create} from 'zustand'
import useFirebaseStore from './FirebaseStore'

interface LetterState {
  letterList: any[]

  subscribeLetterList: () => void
  unsubscribeLetterList: () => void
  addLetter: (letter: LetterModel) => Promise<boolean>
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
    addLetter: async letter => {
      const checkDuplicated = await firebaseStore.checkDuplicate(
        'letters',
        'title',
        letter.title,
      )
      if (!checkDuplicated) {
        const result = await firebaseStore.addDataToRdb('/letters', letter)
        return result
      }
      return false
    },
    uploadLetterImage: async (fileName, uri) => {
      const result = await firebaseStore.uploadImage(`letters/${fileName}`, uri)
      return result
    },
  }
})

export default useLetterStore
