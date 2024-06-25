type LetterScreenProps = {
  currentLetter: LetterModel
}

type PasswordScreenProps = {
  currentLetter: LetterModel
}

type CustomModalScreenProps = {
  isShowOk?: boolean
  isShowCancel?: boolean
  okAction?: () => void
  title?: string
  contents?: string
  okText?: string
  cancelText?: string
}

type EditLetterScreenProps = {
  isEdit?: boolean
}

type EventScreenProps = {
  event: EventModel
}

type EditEventScreenProps = {
  isEdit?: boolean
}
