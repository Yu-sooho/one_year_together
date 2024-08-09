import {CompositeNavigationProp, RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useCallback, useState} from 'react'
import {
  FlatList,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import messaging from '@react-native-firebase/messaging'
import Icon from 'react-native-vector-icons/Feather'
import {normalize} from '../../utils'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

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
      <View style={{flex: 1, alignItems: 'flex-end'}}>
        <TouchableOpacity
          onPress={() => {
            onPressDeleteItem(item)
          }}
          style={{
            height: normalize(60),
            width: normalize(100),
            justifyContent: 'center',
            alignItems: 'flex-end',
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
