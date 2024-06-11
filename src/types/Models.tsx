interface EventModel {
  id: number
}

interface UserModel {
  id: number
}

interface LetterModel {
  id: number
  title: string
  content: string
  password: string
  hint?: string
  createdAt: Date
  deletedAt: Date
}
