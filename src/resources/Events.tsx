import {images} from '.'
import {daysUntil} from '../utils'

export const FIRST_DATE = new Date(2023, 4, 21)
export const START_DATE = new Date(2023, 6, 25)
export const MARRY_DATE = new Date(2024, 4, 14)

export const FIRST_MEET: EventModel = {
  title: '처음 만난 날',
  content: '처음 만난 날!',
  targetAt: daysUntil(FIRST_DATE),
  //   imageUrl?: string[]
  localImageUrl: [images.first_meet],
}
export const START_EVENT: EventModel = {
  title: '사랑하기 시작한 날',
  content: '',
  targetAt: daysUntil(START_DATE),
  //   imageUrl?: string[]
}
export const MARRY_EVENT: EventModel = {
  title: '결혼한 날',
  content: '',
  targetAt: daysUntil(MARRY_DATE),
  //   imageUrl?: string[]
  localImageUrl: [images.marry_event],
}
