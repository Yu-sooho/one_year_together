import React, {memo} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import FastImage from 'react-native-fast-image'
import {useAuthStore} from '../../stores'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../../styles/colors'
import {normalize} from '../../utils'
import {useNavigation} from '@react-navigation/native'

interface LetterListitemProps {
  item: LetterModel
  index: number
  onPressItem: (item: LetterModel, isLocked: IsLockedModel) => void
}

const LetterListItem: React.FC<LetterListitemProps> = ({
  item,
  index,
  onPressItem,
}) => {
  const currentUser = useAuthStore(state => state.currentUser)
  const isLocked =
    item?.password &&
    !item?.isUnLockedUserId?.find(element => element === currentUser?.email)

  const onPress = () => {
    onPressItem(item, isLocked)
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {isLocked ? (
        <View style={styles.image}>
          <Icon name="lock" size={normalize(24)} color={colors.c242424} />
        </View>
      ) : (
        <FastImage source={{uri: item?.imageUrl}} style={styles.image} />
      )}
      <Text>{item?.title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: '33.3%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cf4f4f4,
  },
})

export default memo(LetterListItem)
