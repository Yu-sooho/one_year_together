import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import addUserToDatabase from './addUserToDatabase'

admin.initializeApp()

exports.addUserToDatabase = functions.auth.user().onCreate(user => {
  return addUserToDatabase(user)
})
