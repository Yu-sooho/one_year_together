import {StyleSheet} from 'react-native'
import colors from './colors'
import {normalize} from '../utils'

const defaultStyles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.cffffff,
  },
  noBackgroundStyle: {
    backgroundColor: colors.transparent,
  },
  centerContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    paddingTop: normalize(20),
  },
  scrollContentContainerStyle: {
    paddingBottom: normalize(52),
  },
})

export default defaultStyles
