import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const createNotifeeOnEventCreate = functions.database
  .ref('/events/{eventId}')
  .onCreate(async (snapshot, context) => {
    const eventKey = snapshot.key
    const eventData = snapshot.val()
    const uid = eventData.createdUser

    const userSnapshot = await admin
      .database()
      .ref(`/users/${uid}`)
      .once('value')
    const userData = userSnapshot.val()

    if (!userData) {
      console.error(`${uid} 사용자를 찾을 수 없습니다.`)
      return
    }

    const partnerId = userData.partner

    try {
      const notifeeRef = admin.database().ref(`/notifees/${partnerId}`).push()
      const notifeeKey = notifeeRef.key
      await notifeeRef.set({
        userId: eventData.createdUser,
        partnerId: partnerId,
        title: `특별한날!!`,
        message: `기억하자!! ${eventData.title}`,
        createdAt: Date.now(),
        readedAt: null,
        isRead: false,
        type: 'event',
        targetKey: eventKey,
        key: notifeeKey,
      })

      console.log('이벤트 데이터 생성 성공:', notifeeRef.key)
    } catch (error) {
      console.error('이벤트 데이터 생성 실패:', error)
    }
  })
