import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get('window');

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

const scaleWidth = width / BASE_WIDTH;
const scaleHeight = height / BASE_HEIGHT;

const scale = Math.min(scaleWidth, scaleHeight);

export function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
