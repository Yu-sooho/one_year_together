import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database'
import {memo} from 'react'

const firebaseConfig = {
  apiKey: 'AIzaSyAxbKvf7O4XUVaVawwSs6eu6DyMH7tYPZg',
  authDomain: 'one-year-together.firebaseapp.com',
  databaseURL: 'https://one-year-together.firebaseio.com',
  projectId: 'one-year-together',
  storageBucket: 'one-year-together.appspot.com',
  messagingSenderId: '461587742058',
  appId: '1:461587742058:ios:91b7371ca48455536d3913',
  measurementId: '', // Optional, 제공되지 않은 경우 빈 문자열로 남겨둡니다.
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const FirebaseController = memo(() => {
  return null
})

export default FirebaseController
