import {StyleSheet} from 'react-native'
import {normalize} from '../utils'
import colors from './colors'

enum CUSTOM_FONT {
  BMJUA = 'BMJUA',
  NanumGaRamYeonGgoc = 'NanumGaRamYeonGgoc',
  NanumGgocNaeEum = 'NanumGgocNaeEum',
}

const styles = StyleSheet.create({
  defaultBmjuaProperty: {
    fontFamily: CUSTOM_FONT.BMJUA,
    color: colors.c242424,
    includeFontPadding: false,
    fontWeight: '100',
  },
  defaultNanumgyProperty: {
    fontFamily: CUSTOM_FONT.NanumGaRamYeonGgoc,
    color: colors.c242424,
    includeFontPadding: false,
    fontWeight: '100',
  },
  defaultNanumgnProperty: {
    fontFamily: CUSTOM_FONT.NanumGgocNaeEum,
    color: colors.c242424,
    includeFontPadding: false,
    fontWeight: '100',
  },
})

export default StyleSheet.create({
  bmjua14: {
    ...styles.defaultBmjuaProperty,
    fontSize: normalize(14),
  },
  bmjua16: {
    ...styles.defaultBmjuaProperty,
    fontSize: normalize(16),
  },
  bmjua18: {
    ...styles.defaultBmjuaProperty,
    fontSize: normalize(18),
  },
  bmjua20: {
    ...styles.defaultBmjuaProperty,
    fontSize: normalize(20),
  },
  bmjua24: {
    ...styles.defaultBmjuaProperty,
    fontSize: normalize(24),
  },
  nanumgy12: {
    ...styles.defaultNanumgnProperty,
    fontSize: normalize(12),
  },
  nanumgy24: {
    ...styles.defaultNanumgnProperty,
    fontSize: normalize(24),
  },
  nanumgn12: {
    ...styles.defaultNanumgnProperty,
    fontSize: normalize(12),
  },
  nanumgn18: {
    ...styles.defaultNanumgnProperty,
    fontSize: normalize(18),
  },
  nanumgn24: {
    ...styles.defaultNanumgnProperty,
    fontSize: normalize(24),
  },
})
