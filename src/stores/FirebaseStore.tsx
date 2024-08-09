import {create} from 'zustand'
import firebase from '@react-native-firebase/app'
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database'
import {DEV_PORT_NUMBER, FIREBASE_CONFIG, IS_DEV} from '../utils'
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'

if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG)
}

if (IS_DEV) {
  database().useEmulator('localhost', DEV_PORT_NUMBER.RDB)
  storage().useEmulator('localhost', DEV_PORT_NUMBER.STORAGE)
  auth().useEmulator(`http://localhost:${DEV_PORT_NUMBER.AUTH}`)
}

interface FirebaseState {
  subscribeRdb: (
    ref: string,
    setData: (list: any[]) => void,
    isReverse?: boolean,
  ) => void
  subscribeRdbObj: (ref: string, setData: (data: any | null) => void) => void
  unSubscribeRdb: (ref: string, dataSnapshot: any) => void
  addDataToRdb: (ref: string, data: any) => Promise<boolean>
  addDataToOriginRdb: (ref: string, data: any) => Promise<boolean>
  deleteDataToRdb: (ref: string) => Promise<boolean>
  updateDataToRdb: (
    ref: string,
    data: any,
    snapshot: FirebaseDatabaseTypes.DataSnapshot,
  ) => Promise<boolean>
  uploadImage: (ref: string, uri: string) => Promise<string | false>
  checkDuplicate: (
    ref: string,
    fieldName: string,
    fieldValue: any,
  ) => Promise<false | FirebaseDatabaseTypes.DataSnapshot>

  loginCheck: () => Promise<false | FirebaseAuthTypes.User>
}

const useFirebaseStore = create<FirebaseState>((set, get) => ({
  subscribeRdb: (ref, setData, isReverse) => {
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
        if (isReverse) {
          list.reverse()
        }
        setData(list)
      })
    console.log('firebase subscribeRdb', ref)
    return temp
  },

  subscribeRdbObj: (ref, setData) => {
    const temp = database()
      .ref(ref)
      .on('value', snapshot => {
        const data = snapshot.val()
        if (data) {
          const result = {
            key: snapshot.key,
            ...data,
          }
          setData(result)
        } else {
          setData(null)
        }
      })
    console.log('firebase subscribeRdbObj', ref)
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
      return snapshot
    } else {
      return false
    }
  },

  addDataToOriginRdb: async (ref, data) => {
    console.log(`firebaseStore addDataToOriginRdb start`, ref, data)
    const timestamp = database.ServerValue.TIMESTAMP
    const uid = await auth().currentUser?.uid
    if (!data) return false
    try {
      if (!data?.createdAt) {
        data.createdAt = timestamp
      } else {
        data.updatedAt = timestamp
      }
      data.createdUser = uid
      const newEventRef = database().ref(ref)
      await newEventRef.set(data)
      console.log(`firebaseStore addDataToOriginRdb finish success`)
      return true
    } catch (error) {
      console.log(`firebaseStore addDataToOriginRdb error`, error)
      return false
    }
  },

  addDataToRdb: async (ref, data) => {
    console.log(`firebaseStore addDataToRdb start`, ref, data)
    const timestamp = database.ServerValue.TIMESTAMP
    const uid = await auth().currentUser?.uid
    if (!data) return false
    try {
      data.createdAt = timestamp
      data.createdUser = uid
      const newEventRef = database().ref(ref).push()
      await newEventRef.set(data)
      console.log(`firebaseStore addDataToRdb finish success`)
      return true
    } catch (error) {
      console.log(`firebaseStore addDataToRdb error`, error)
      return false
    }
  },

  deleteDataToRdb: async ref => {
    try {
      console.log(`firebaseStore deleteDataToRdb start`, ref)
      await database().ref(ref).remove()
      console.log(`firebaseStore deleteDataToRdb finish`, ref)
      return true
    } catch (error) {
      console.log(`firebaseStore deleteDataToRdb error`, ref)
      return false
    }
  },

  updateDataToRdb: async (ref, data, snapshot) => {
    const timestamp = database.ServerValue.TIMESTAMP
    if (!data) return false
    try {
      data.updatedAt = timestamp
      const updates: {[key: string]: any} = {}
      snapshot.forEach(childSnapshot => {
        updates[childSnapshot.key as string] = {...childSnapshot.val(), ...data}
        return true
      })
      await database().ref(ref).update(updates)
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

  loginCheck: async () => {
    const currentUser = await auth().currentUser
    try {
      if (currentUser) {
        console.log('User is logged in:', currentUser)
        return currentUser
      } else {
        console.log('No user is logged in.')
        return false
      }
    } catch (error) {
      console.log('logged in error.', error)
      return false
    }
  },
}))

export default useFirebaseStore
