import React, {memo} from 'react'
import {
  ListRenderItem,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'

interface LetterListitemProps {
  item: LetterModel
  index: number
}

const LetterListItem: React.FC<LetterListitemProps> = ({item, index}) => {
  return (
    <View style={styles.container}>
      <FastImage source={{uri: item?.imageUrl}} style={styles.image} />
      <Text>{item?.title}</Text>
    </View>
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
  },
})

export default memo(LetterListItem)
