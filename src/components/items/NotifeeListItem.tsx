import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import {normalize, timestampToDate} from '../../utils'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'
import moment from 'moment'

const NotifeeListItem = ({
  item,
  index,
  isChecked,
  onPressItem,
  onPressDeleteItem,
}: {
  item: NotifeeModel
  index: number
  isChecked: boolean
  onPressItem: (item: NotifeeModel) => void
  onPressDeleteItem: (item: NotifeeModel) => void
}) => {
  const isRead = item?.isRead
  const date = item.createdAt && timestampToDate(item.createdAt)

  const formatDate = () => {
    const currentTime = moment()
    const targetTime = moment(date)

    const duration = moment.duration(currentTime.diff(targetTime))
    const hoursDiff = duration.asHours()

    if (hoursDiff < 24) {
      return targetTime.format('HH:mm')
    }
    return targetTime.format('YY.MM.DD')
  }

  return (
    <TouchableOpacity
      onPress={() => {
        onPressItem(item)
      }}
      style={styles.listItemContainer}>
      {item?.type === 'event' && (
        <Icon
          name="calendar"
          size={normalize(24)}
          color={isRead ? colors.cbfbfbf : colors.c242424}
        />
      )}
      {item?.type === 'letter' && (
        <Icon
          name="mail"
          size={normalize(24)}
          color={isRead ? colors.cbfbfbf : colors.c242424}
        />
      )}
      {item?.type === 'tease' && (
        <Icon
          name="wind"
          size={normalize(24)}
          color={isRead ? colors.cbfbfbf : colors.c242424}
        />
      )}
      <View style={{marginLeft: normalize(12)}}>
        <Text
          style={{
            ...fonts.bmjua14,
            color: isRead ? colors.cbfbfbf : colors.c242424,
            marginBottom: normalize(4),
          }}>
          {item?.title}
        </Text>
        <Text
          style={{
            ...fonts.bmjua14,
            color: isRead ? colors.cbfbfbf : colors.c242424,
          }}>
          {item?.message}
        </Text>
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
            height: normalize(60),
          }}>
          <Text
            style={{
              ...fonts.bmjua14,
              fontSize: normalize(12),
              color: isRead ? colors.cbfbfbf : colors.c242424,
            }}>
            {formatDate()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            onPressDeleteItem(item)
          }}
          style={{
            height: normalize(60),
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingLeft: normalize(20),
          }}>
          {isChecked ? (
            <Icon
              name="check-square"
              size={normalize(24)}
              color={!isChecked ? colors.cbfbfbf : colors.c242424}
            />
          ) : (
            <Icon
              name="square"
              size={normalize(24)}
              color={!isChecked ? colors.cbfbfbf : colors.c242424}
            />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  listItemContainer: {
    height: normalize(80),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
  },
})

export default NotifeeListItem
