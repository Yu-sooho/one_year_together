import React from 'react'
import {Dimensions, StyleSheet, Text, View} from 'react-native'
import {MainScreenHeaderProps} from '../../types/ComponentTypes'
import colors from '../../styles/colors'
import {MAIN_HEADER_MAX_SIZE, MAIN_HEADER_MIN_SIZE} from '../../styles/const'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

const MainScreenHeader: React.FC<MainScreenHeaderProps> = ({eventList}) => {
  const inset = useSafeAreaInsets()
  return (
    <View
      style={[
        styles.container,
        {
          height: MAIN_HEADER_MAX_SIZE + inset.top,
          justifyContent: 'space-between',
        },
      ]}>
      <View style={{height: inset.top, backgroundColor: colors.c87cefa}} />
      <View>
        <Text>나는 제목</Text>
        <Text>나는 날짜</Text>
      </View>
      <View
        style={{height: MAIN_HEADER_MIN_SIZE, backgroundColor: colors.c87cefa}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    backgroundColor: colors.c24242480,
  },
})

export default MainScreenHeader
