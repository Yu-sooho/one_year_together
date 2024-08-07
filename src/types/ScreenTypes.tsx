type LetterScreenProps = {
  currentLetter: LetterModel
}

type PasswordScreenProps = {
  currentLetter: LetterModel
}

type NotifeeListScreenProps = {}

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
  letter?: LetterModel
}

type EventScreenProps = {
  event: EventModel
}

type EditEventScreenProps = {
  isEdit?: boolean
  event?: EventModel
}
