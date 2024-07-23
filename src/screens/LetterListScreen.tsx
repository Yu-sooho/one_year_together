import {CompositeNavigationProp, RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {memo, useEffect} from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  ListRenderItem,
  Dimensions,
} from 'react-native'
import defaultStyles from '../styles'
import {SafeAreaView} from 'react-native-safe-area-context'
import {CustomHeader, LetterListItem} from '../components'
import {useAuthStore, useLetterStore} from '../stores'
import {normalize} from '../utils'
import Icon from 'react-native-vector-icons/Feather'
import colors from '../styles/colors'
import FastImage from 'react-native-fast-image'
import {images} from '../resources'

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

const {width, height} = Dimensions.get('window')

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
    <FastImage style={styles.image} source={images.default_letter}>
      <View style={styles.blackOpacity} />
      <SafeAreaView style={[defaultStyles.containerStyle, styles.noBackground]}>
        <CustomHeader
          title=""
          containerStyle={styles.noBackground}
          onPressButton={navigatedEditLetterScreen}
          iconColor={colors.cffffff}
          rightContent={
            <Icon name="plus" size={normalize(24)} color={colors.cffffff} />
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
    </FastImage>
  )
})

const styles = StyleSheet.create({
  noBackground: {
    backgroundColor: colors.transparent,
  },
  blackOpacity: {
    width,
    height: height * 2,
    backgroundColor: colors.c24242480,
    position: 'absolute',
  },
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
  image: {
    flex: 1,
  },
})

export default LetterListScreen
