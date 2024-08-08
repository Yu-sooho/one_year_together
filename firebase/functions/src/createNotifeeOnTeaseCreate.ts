import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const createNotifeeOnTeaseCreate = functions.database
  .ref('/teases/{teaseId}')
  .onCreate(async (snapshot, context) => {
    const teaseKey = snapshot.key
    const teaseData = snapshot.val()
    const uid = teaseData.createdUser

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
        userId: teaseData.createdUser,
        partnerId: partnerId,
        title: `편지 빨리봐!!!`,
        message: `${teaseData.title} 이거 빨리 풀어봐봐!!`,
        createdAt: Date.now(),
        readedAt: null,
        isRead: false,
        type: 'tease',
        targetKey: teaseKey,
        key: notifeeKey,
      })

      console.log('조르기 데이터 생성 성공:', notifeeRef.key)
    } catch (error) {
      console.error('조르기 데이터 생성 실패:', error)
    }
  })
