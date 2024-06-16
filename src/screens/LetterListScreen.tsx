import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  ListRenderItem,
} from 'react-native'
import defaultStyles from '../styles'
import {SafeAreaView} from 'react-native-safe-area-context'
import {CustomBottomButton, CustomHeader, LetterListItem} from '../components'
import database from '@react-native-firebase/database'
import {useFirebaseStore, useLetterStore} from '../stores'
import {normalize} from '../utils'

type MainStackNavigatorParamList = {
  LetterListScreen: undefined
  EditLetterScreen: undefined
}

type LetterListScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'LetterListScreen'
>

type LetterListScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'LetterListScreen'
>

type Props = {
  navigation: LetterListScreenNavigationProp
  route: LetterListScreenRouteProp
}

const LetterListScreen: React.FC<Props> = ({navigation, route}) => {
  const navigatedEditLetterScreen = () => {
    navigation.navigate('EditLetterScreen')
  }

  const subscribeLetterList = useLetterStore(state => state.subscribeLetterList)
  const unsubscribeLetterList = useLetterStore(
    state => state.unsubscribeLetterList,
  )
  const letterList = useLetterStore(state => state.letterList)

  useEffect(() => {
    subscribeLetterList()
    return () => unsubscribeLetterList()
  }, [])

  const renderItem: ListRenderItem<LetterModel> = ({item, index}) => (
    <LetterListItem item={item} index={index} />
  )

  const itemSeparatorComponent = () => (
    <View style={styles.itemSeparatorComponentStyle} />
  )
  return (
    <SafeAreaView style={defaultStyles.containerStyle}>
      <CustomHeader title="LetterListScreen" />
      <FlatList
        data={letterList}
        renderItem={renderItem}
        numColumns={3}
        keyExtractor={(item, index) => `${item.title}${index}`}
        ItemSeparatorComponent={itemSeparatorComponent}
        style={styles.listStyle}
        contentContainerStyle={styles.contentContainerStyle}
      />
      <CustomBottomButton
        buttonText={'확인'}
        onPressButton={navigatedEditLetterScreen}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  itemSeparatorComponentStyle: {
    height: normalize(20),
  },
  listStyle: {
    paddingTop: normalize(20),
  },
  contentContainerStyle: {
    paddingBottom: normalize(120),
  },
})

export default React.memo(LetterListScreen)
