import {create} from 'zustand'
import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database'
import {DEV_PORT_NUMBER, FIREBASE_CONFIG, IS_DEV} from '../utils'
import storage from '@react-native-firebase/storage'

if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG)
}

if (IS_DEV) {
  database().useEmulator('localhost', DEV_PORT_NUMBER.RDB)
  storage().useEmulator('localhost', DEV_PORT_NUMBER.STORAGE)
}

interface FirebaseState {
  subscribeRdb: (ref: string, setData: (list: any[]) => void) => void
  unSubscribeRdb: (ref: string, dataSnapshot: any) => void
  addDataToRdb: (ref: string, data: any) => Promise<boolean>
  uploadImage: (ref: string, uri: string) => Promise<string | false>
  checkDuplicate: (
    ref: string,
    fieldName: string,
    fieldValue: any,
  ) => Promise<boolean>
}

const useFirebaseStore = create<FirebaseState>((set, get) => ({
  subscribeRdb: (ref, setData) => {
    const temp = database()
      .ref(ref)
      .on('value', snapshot => {
        const list: any[] = []
        snapshot.forEach(childSnapshot => {
          const object = {
            key: childSnapshot.key,
            ...childSnapshot.val(),
          }
          list.push(object)
          return undefined
        })
        setData(list)
      })
    console.log('firebase subscribeRdb')
    return temp
  },

  unSubscribeRdb: (ref, dataSnapshot) => {
    database().ref(ref).off('value', dataSnapshot)
  },

  checkDuplicate: async (ref, fieldName, fieldValue) => {
    const snapshot = await database()
      .ref(ref)
      .orderByChild(fieldName)
      .equalTo(fieldValue)
      .once('value')

    if (snapshot.exists()) {
      return true
    } else {
      return false
    }
  },

  addDataToRdb: async (ref, data) => {
    if (!data) return false
    try {
      data.createdAt = new Date()
      const newEventRef = database().ref(ref).push()
      await newEventRef.set(data)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },

  uploadImage: async (ref, uri) => {
    const reference = storage().ref(ref)
    try {
      await reference.putFile(uri)
      const downloadURL = await reference.getDownloadURL()
      console.log('Image uploaded and available at:', downloadURL)
      return downloadURL
    } catch (error) {
      console.log(ref)
      console.log(uri)
      console.error('Image upload failed:', error)
      return false
    }
  },
}))

export default useFirebaseStore
