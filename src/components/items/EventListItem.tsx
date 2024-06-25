import React, {memo} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {daysUntil, normalize} from '../../utils'
import fonts from '../../styles/fonts'

interface EventListitemProps {
  item: EventModel
  index: number
  onPressItem: (item: EventModel) => void
  onLongPressItem: (item: EventModel) => void
}

const EventListItem: React.FC<EventListitemProps> = memo(
  ({item, index, onPressItem, onLongPressItem}) => {
    const {targetAt, title, content} = item
    const date = daysUntil(new Date(targetAt))

    const onPress = () => {
      onPressItem(item)
    }

    const onLongPress = () => {
      onLongPressItem(item)
    }

    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.container}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </TouchableOpacity>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    ...fonts.bmjua18,
  },
  dateText: {
    ...fonts.bmjua16,
  },
})

export default EventListItem
