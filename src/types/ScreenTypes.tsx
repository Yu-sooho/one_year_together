type LetterScreenProps = {
  currentEvent: EventModel
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
