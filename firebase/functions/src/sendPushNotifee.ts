import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const sendPushNotifee = functions.database
  .ref('/notifees/{userId}/{pushId}')
  .onCreate(async (snapshot, context) => {
    const pushData = snapshot.val()
    const partnerId = pushData.partnerId

    try {
      const userSnapshot = await admin
        .database()
        .ref(`/users/${partnerId}`)
        .once('value')
      const userData = userSnapshot.val()

      if (!userData) {
        console.error(`${partnerId} 사용자를 찾을 수 없습니다.`)
        return
      }

      if (!userData.isPushNotifee) {
        console.error(`푸시를 거부한 상태입니다.`)
        return
      }
      const message = {
        token: userData.fcmToken,
        notification: {
          title: pushData.title,
          body: pushData.message,
        },
        data: {
          type: pushData.type,
          id: pushData.key,
        },
      }

      const response = await admin.messaging().send(message)

      // const payload = {
      //   notification: {
      //     title: pushData.title,
      //     body: pushData.message,
      //   },
      //   data: {
      //     type: pushData.type,
      //     id: pushData.key,
      //   },
      // }

      // const response = await admin
      //   .messaging()
      //   .sendToDevice(userData.fcmToken, payload)
      console.log('푸시 알림 전송 성공:', response)
    } catch (error) {
      console.error('푸시 알림 전송 실패:', error)
    }
  })
