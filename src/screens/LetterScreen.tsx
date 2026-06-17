import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useRef} from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  ListRenderItem,
} from 'react-native'

import FastImage from '@d11/react-native-fast-image'
import {CustomBackgroundOpacity, CustomHeader} from '../components'
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context'
import colors from '../styles/colors'
import {normalize} from '../utils'
import fonts from '../styles/fonts'

type LetterScreenNavigationProp = StackNavigationProp<
  LetterStackNavigatorParamList,
  'LetterScreen'
>
type LetterScreenRouteProp = RouteProp<
  LetterStackNavigatorParamList,
  'LetterScreen'
>

type Props = {
  navigation: LetterScreenNavigationProp
  route: LetterScreenRouteProp
}

const LetterScreen: React.FC<Props> = ({navigation, route}) => {
  const {currentLetter} = route.params
  const {imageUrl, title, content} = currentLetter

  const inset = useSafeAreaInsets()

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height + inset.top,
    },
    image: {
      justifyContent: 'center',
      alignItems: 'center',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height + inset.top,
    },
    contentContainer: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height + inset.top,
      position: 'absolute',
    },
    contentText: {
      ...fonts.bmjua16,
      color: colors.cffffff,
      textAlign: 'center',
    },
    listContainer: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height + inset.top,
    },
  })
  const flatListRef = useRef<FlatList<string>>(null)
  const scrollIndex = useRef(0)
  const animInterval = useRef<any>(null)

  const eventAnimatedInit = () => {
    if (
      !currentLetter ||
      !currentLetter.imageUrl ||
      currentLetter.imageUrl.length <= 0
    )
      return
    animInterval.current = setInterval(() => {
      if (flatListRef.current) {
        scrollIndex.current =
          (scrollIndex.current + 1) %
          (currentLetter.imageUrl ? currentLetter.imageUrl.length : 0)
        flatListRef.current.scrollToIndex({
          animated: false,
          index: scrollIndex.current,
        })
      }
    }, 4000)
  }

  useEffect(() => {
    eventAnimatedInit()
    return () => clearInterval(animInterval.current)
  }, [])

  const renderItem: ListRenderItem<string> = ({item, index}) => {
    return (
      <View>
        <FastImage style={styles.image} source={{uri: item}} />
        <CustomBackgroundOpacity />
      </View>
    )
  }

  const isHaveImage = currentLetter.imageUrl

  return (
    <View style={styles.container}>
      {isHaveImage && (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ref={flatListRef}
          pointerEvents="none"
          horizontal
          pagingEnabled
          style={styles.listContainer}
          renderItem={renderItem}
          data={isHaveImage}
          bounces={false}
        />
      )}
      <SafeAreaView style={styles.contentContainer}>
        <CustomHeader
          title={title}
          containerStyle={{
            backgroundColor: colors.transparent,
          }}
          iconColor={colors.cffffff}
          titleStyle={{color: colors.cffffff}}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: normalize(120),
            paddingBottom: normalize(250),
          }}>
          <View
            style={{
              alignItems: 'center',
              paddingHorizontal: normalize(20),
            }}>
            <Text style={styles.contentText}>{content}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default LetterScreen
