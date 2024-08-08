interface defaultData {
  createdAt?: Date
  deletedAt?: Date
  createdUser?: string
}

interface EventModel extends defaultData {
  title: string
  content: string
  targetAt: number
  imageUrl?: string[]
  localImageUrl?: string[]
  isDefault?: boolean
}

interface SettingModel extends defaultData {
  widgetImageUrl?: string | null
  homeImageUrl?: string | null
}

interface UserModel extends defaultData {
  isPushNotifee: boolean
  fcmToken?: string | null
  partner?: string
}

interface TeaseModel extends defaultData {
  title: string
}

interface NotifeeModel extends defaultData {
  userId: string
  partnerId: string
  title: string
  message: string
  readedAt: Date | null
  isRead: boolean
  type: 'tease' | 'event' | 'letter'
  key: string
}

interface LetterModel extends defaultData {
  title: string
  content: string
  password?: string
  hint?: string
  // imageUrl?: string
  imageUrl?: string[]
  isUnLockedUserId?: string[]
}

type IsLockedModel = string | undefined | boolean
