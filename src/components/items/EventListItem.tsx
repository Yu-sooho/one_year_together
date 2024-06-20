import React, {memo} from 'react'
import {Text, View} from 'react-native'

interface EventListitemProps {
  item: EventModel
  index: number
  onPressItem: (item: EventModel) => void
  onLongPressItem: (item: EventModel) => void
}

const EventListItem: React.FC<EventListitemProps> = memo(
  ({item, index, onPressItem, onLongPressItem}) => {
    return (
      <View>
        <Text>123</Text>
      </View>
    )
  },
)

export default EventListItem
