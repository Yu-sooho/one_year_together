import * as admin from 'firebase-admin'
import {UserRecord} from 'firebase-functions/v1/auth'

const addUserToDatabase = async (user: UserRecord) => {
  const email = user.email
  const uid = user.uid

  if (!email) {
    console.error('No email found for user:', uid)
    return
  }

  const createdAt = Date.now()

  try {
    await admin.database().ref(`/users/${uid}`).set({
      email: email,
      createdAt: createdAt,
    })
    console.log('User data added to Realtime Database')
  } catch (error) {
    console.error('Error adding user data to Realtime Database:', error)
  }
}

export default addUserToDatabase
