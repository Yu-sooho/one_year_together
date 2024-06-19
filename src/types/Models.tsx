interface Id {
  createdAt?: Date
  deletedAt?: Date
  createdUser?: string
}

interface EventModel extends Id {}

interface UserModel extends Id {}

interface LetterModel extends Id {
  title: string
  content: string
  password?: string
  hint?: string
  imageUrl?: string
  isUnLockedUserId?: string[]
}

type IsLockedModel = string | undefined | boolean
