import React, {memo} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {daysUntil, normalize} from '../../utils'
import fonts from '../../styles/fonts'
import {ImageOrVideo} from 'react-native-image-crop-picker'
import colors from '../../styles/colors'
import FastImage from 'react-native-fast-image'

interface EventImageListItemProps {
  item: ImageOrVideo
  index: number
  onPressItem: (item: ImageOrVideo) => void
}

const EventImageListItem: React.FC<EventImageListItemProps> = memo(
  ({item, index, onPressItem}) => {
    const onPress = () => {
      onPressItem(item)
    }

    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <FastImage style={styles.container} source={{uri: item?.path}} />
      </TouchableOpacity>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    width: normalize(50),
    height: normalize(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: normalize(4),
    borderColor: colors.cf4f4f4,
    borderWidth: normalize(1),
  },
  titleText: {
    ...fonts.bmjua18,
  },
  dateText: {
    ...fonts.bmjua16,
  },
})

export default EventImageListItem
