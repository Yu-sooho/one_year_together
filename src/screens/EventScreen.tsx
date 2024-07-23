import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useRef} from 'react'
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import defaultStyles from '../styles'
import FastImage from 'react-native-fast-image'
import {CustomBackgroundOpacity, CustomHeader} from '../components'
import {SafeAreaView} from 'react-native-safe-area-context'
import colors from '../styles/colors'
import {daysUntil, normalize} from '../utils'
import {images} from '../resources'
import fonts from '../styles/fonts'

type EventScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'EventScreen'
>
type EventScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'EventScreen'
>

type Props = {
  navigation: EventScreenNavigationProp
  route: EventScreenRouteProp
}

const EventScreen: React.FC<Props> = ({navigation, route}) => {
  const {event} = route?.params
  const flatListRef = useRef<FlatList<string>>(null)
  const scrollIndex = useRef(0)
  const animInterval = useRef<any>(null)

  const eventAnimatedInit = () => {
    if (!event || !event.imageUrl || event.imageUrl.length <= 0) return
    animInterval.current = setInterval(() => {
      if (flatListRef.current) {
        scrollIndex.current =
          (scrollIndex.current + 1) %
          (event.imageUrl ? event.imageUrl.length : 0)
        flatListRef.current.scrollToIndex({
          animated: true,
          index: scrollIndex.current,
        })
      }
    }, 2000)
  }

  useEffect(() => {
    eventAnimatedInit()
    return () => clearInterval(animInterval.current)
  }, [])

  const date = event?.targetAt
  const isHaveImage = event.imageUrl || event.localImageUrl

  const onPressAdd = () => {
    navigation.navigate('EditEventScreen', {isEdit: true, event: event})
  }

  const renderItem: ListRenderItem<string> = ({item, index}) => {
    return (
      <View>
        <FastImage
          style={styles.imageStyle}
          source={event.localImageUrl ? parseInt(item) : {uri: item}}
        />
        <CustomBackgroundOpacity />
      </View>
    )
  }

  return (
    <View style={defaultStyles.centerContainerStyle}>
      {isHaveImage && (
        <FlatList
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
      <SafeAreaView style={isHaveImage ? styles.container : styles.noImage}>
        <CustomHeader
          title={event.title}
          containerStyle={
            isHaveImage && {
              backgroundColor: colors.transparent,
            }
          }
          iconColor={isHaveImage && colors.cffffff}
          titleStyle={isHaveImage && {color: colors.cffffff}}
        />
        {!event?.isDefault ? (
          <>
            <View style={styles.dateView}>
              <Text style={styles.dateText}>{`${date}일째!`}</Text>
            </View>
            <ScrollView contentContainerStyle={{paddingTop: normalize(120)}}>
              <View style={{alignItems: 'center'}}>
                <Text style={styles.contentText}>{event.content}</Text>
              </View>
            </ScrollView>
          </>
        ) : (
          <View style={styles.addContent}>
            <TouchableOpacity onPress={onPressAdd} style={styles.addButton}>
              <Text style={styles.addText}>오늘은 어떤 추억이야?</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  )
}

const AnimationList = () => {}

const styles = StyleSheet.create({
  listContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  imageStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  noImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colors.cffffff,
  },
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
  },
  dateView: {
    height: normalize(40),
    paddingHorizontal: normalize(20),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  dateText: {
    ...fonts.bmjua16,
    color: colors.cffffff,
  },
  contentText: {
    ...fonts.bmjua16,
    color: colors.cffffff,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: '100%',
    height: normalize(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(120),
  },
  addText: {
    ...fonts.bmjua14,
  },
})

export default EventScreen
