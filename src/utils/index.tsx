import {Dimensions, PixelRatio} from 'react-native'

const {width, height} = Dimensions.get('window')

const BASE_WIDTH = 390
const BASE_HEIGHT = 844

const scaleWidth = width / BASE_WIDTH
const scaleHeight = height / BASE_HEIGHT

const scale = Math.min(scaleWidth, scaleHeight)

export function normalize(size: number) {
  const newSize = size * scale
  return Math.round(PixelRatio.roundToNearestPixel(newSize))
}

export const findKeyByValueForRecord = (
  record: Record<any, any>,
  value: string,
  nagative?: boolean,
): Array<any> => {
  const keys = []
  for (let key in record) {
    if (nagative && record[key] !== value) {
      keys.push(key)
    } else if (!nagative && record[key] === value) {
      keys.push(key)
    }
  }
  return keys
}

export const findKeyByValueForMap = (
  map: Map<any, any>,
  value: any,
): Array<any> => {
  const keys = []
  for (let [key, val] of map.entries()) {
    if (val === value) {
      keys.push(key)
    }
  }
  return keys
}
