import {CompositeNavigationProp, RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {memo, useEffect} from 'react'
import {View, FlatList, StyleSheet, ListRenderItem} from 'react-native'
import defaultStyles from '../styles'
import {SafeAreaView} from 'react-native-safe-area-context'
import {CustomHeader, LetterListItem} from '../components'
import {useAuthStore, useLetterStore} from '../stores'
import {normalize} from '../utils'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../styles/colors'

type LetterListScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackNavigatorParamList, 'LetterListScreen'>,
  StackNavigationProp<LetterStackNavigatorParamList>
>

type LetterListScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'LetterListScreen'
>

type Props = {
  navigation: LetterListScreenNavigationProp
  route: LetterListScreenRouteProp
}

const LetterListScreen: React.FC<Props> = memo(({navigation, route}) => {
  const navigatedEditLetterScreen = () => {
    navigation.navigate('EditLetterScreen', {isEdit: false})
  }

  const currentUser = useAuthStore(state => state.currentUser)
  const deleteLetter = useLetterStore(state => state.deleteLetter)
  const subscribeLetterList = useLetterStore(state => state.subscribeLetterList)
  const unsubscribeLetterList = useLetterStore(
    state => state.unsubscribeLetterList,
  )
  const letterList = useLetterStore(state => state.letterList)

  useEffect(() => {
    subscribeLetterList()
    return () => unsubscribeLetterList()
  }, [])

  const navigatedLetterScreen = (
    letter: LetterModel,
    isLocked: IsLockedModel,
  ) => {
    if (isLocked) {
      navigation.navigate('PasswordScreen', {
        currentLetter: letter,
      })
      return
    }
    navigation.navigate('LetterScreen', {
      currentLetter: letter,
    })
  }

  const deletedLetter = (letter: LetterModel) => {
    deleteLetter(letter)
  }

  const navigatedCustomModal = (letter: LetterModel) => {
    if (letter.createdUser !== currentUser?.email) return
    navigation.navigate('CustomModalScreen', {
      okAction: () => deletedLetter(letter),
    })
  }

  const renderItem: ListRenderItem<LetterModel> = ({item, index}) => (
    <LetterListItem
      item={item}
      index={index}
      onPressItem={navigatedLetterScreen}
      onLongPressItem={navigatedCustomModal}
    />
  )

  const itemSeparatorComponent = () => (
    <View style={styles.itemSeparatorComponentStyle} />
  )

  return (
    <SafeAreaView style={defaultStyles.containerStyle}>
      <CustomHeader
        title=""
        onPressButton={navigatedEditLetterScreen}
        rightContent={
          <Icon name="plus" size={normalize(24)} color={colors.c242424} />
        }
      />
      <FlatList
        data={letterList}
        renderItem={renderItem}
        numColumns={3}
        keyExtractor={(item, index) => `${item.title}${index}`}
        ItemSeparatorComponent={itemSeparatorComponent}
        style={styles.listStyle}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  itemSeparatorComponentStyle: {
    height: normalize(20),
  },
  listStyle: {
    paddingTop: normalize(20),
    paddingHorizontal: normalize(20),
  },
  contentContainerStyle: {
    paddingBottom: normalize(120),
  },
})

export default LetterListScreen
