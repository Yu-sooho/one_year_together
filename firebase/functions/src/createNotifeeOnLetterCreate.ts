import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const createNotifeeOnLetterCreate = functions.database
  .ref('/letters/{letterId}')
  .onCreate(async (snapshot, context) => {
    const letterKey = snapshot.key
    const letterData = snapshot.val()
    const uid = letterData.createdUser

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
        userId: letterData.createdUser,
        partnerId: partnerId,
        title: `편지왔어!!`,
        message: `${letterData.title}`,
        createdAt: Date.now(),
        readedAt: null,
        isRead: false,
        type: 'letter',
        targetKey: letterKey,
        key: notifeeKey,
      })

      console.log('편지 데이터 생성 성공:', notifeeRef.key)
    } catch (error) {
      console.error('편지 데이터 생성 실패:', error)
    }
  })
