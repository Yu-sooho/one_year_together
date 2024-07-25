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
  isPushNotifee: boolean
}

interface UserModel extends defaultData {}

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
