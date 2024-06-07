import {StyleSheet} from 'react-native'
import {normalize} from '../utils'
import colors from './colors'

enum CUSTOM_FONT {
  BMJUA = 'BMJUA',
  NanumGaRamYeonGgoc = 'NanumGaRamYeonGgoc',
  NanumGgocNaeEum = 'NanumGgocNaeEum',
}

export default StyleSheet.create({
  bmjua14: {
    fontFamily: CUSTOM_FONT.BMJUA,
    fontSize: normalize(14),
    color: colors.c242424,
    includeFontPadding: false,
  },
  bmjua20: {
    fontFamily: CUSTOM_FONT.BMJUA,
    fontSize: normalize(20),
    color: colors.c242424,
    includeFontPadding: false,
  },
  bmjua24: {
    fontFamily: CUSTOM_FONT.BMJUA,
    fontSize: normalize(24),
    color: colors.c242424,
    includeFontPadding: false,
  },
  nanumgy24: {
    fontFamily: CUSTOM_FONT.NanumGaRamYeonGgoc,
    fontSize: normalize(24),
    color: colors.c242424,
    includeFontPadding: false,
  },
  nanumgn24: {
    fontFamily: CUSTOM_FONT.NanumGgocNaeEum,
    fontSize: normalize(24),
    color: colors.c242424,
    includeFontPadding: false,
  },
})
