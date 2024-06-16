interface Id {
  id?: number
  createdAt?: Date
  deletedAt?: Date
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
