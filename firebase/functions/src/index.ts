import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import addUserToDatabase from './addUserToDatabase'
import {createNotifeeOnLetterCreate} from './createNotifeeOnLetterCreate'
import {createNotifeeOnEventCreate} from './createNotifeeOnEventCrete'
import {createNotifeeOnTeaseCreate} from './createNotifeeOnTeaseCreate'
import {sendPushNotifee} from './sendPushNotifee'

admin.initializeApp()

exports.addUserToDatabase = functions.auth.user().onCreate(user => {
  return addUserToDatabase(user)
})

exports.createNotifeeOnLetterCreate = createNotifeeOnLetterCreate
exports.createNotifeeOnEventCreate = createNotifeeOnEventCreate
exports.createNotifeeOnTeaseCreate = createNotifeeOnTeaseCreate
exports.sendPushNotifee = sendPushNotifee
