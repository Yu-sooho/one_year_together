import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native'
import DatePicker from 'react-native-date-picker'
import {SafeAreaView} from 'react-native-safe-area-context'
import defaultStyles from '../styles'
import {
  CustomBottomButton,
  CustomHeader,
  EventImageListItem,
  TextInputTitle,
  TextInputWithTitle,
} from '../components'
import colors from '../styles/colors'
import {dateToTimestamp, daysUntil, getFileExtension, normalize} from '../utils'
import {useAppStateStore, useEventStore, usePermissionStore} from '../stores'
import Icon from 'react-native-vector-icons/Feather'
import {FirebaseDatabaseTypes} from '@react-native-firebase/database'
import ImageCropPicker, {ImageOrVideo} from 'react-native-image-crop-picker'

type EditEventScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'EditEventScreen'
>
type EditEventScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'EditEventScreen'
>

type Props = {
  navigation: EditEventScreenNavigationProp
  route: EditEventScreenRouteProp
}

const EditEventScreen: React.FC<Props> = ({navigation, route}) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(new Date())
  const [imageList, setImageList] = useState<ImageOrVideo[] | null>(null)

  const showToast = useAppStateStore(state => state.showToast)
  const setIsLoading = useAppStateStore(state => state.setIsLoading)

  const addEvent = useEventStore(state => state.addEvent)
  const updateEvent = useEventStore(state => state.updateEvent)
  const checkDuplicate = useEventStore(state => state.checkDuplicated)
  const uploadEventImage = useEventStore(state => state.uploadEventImage)
  const isEdit = route.params?.isEdit

  const onChangeTitle = (value: string) => {
    setTitle(value)
  }

  const onChangeContent = (value: string) => {
    setContent(value)
  }

  const dateFormat = () => {
    if (daysUntil(date) > 0) {
      return `+ D ${daysUntil(date)}`
    } else if (daysUntil(date) === 0) {
      return `D day`
    }
    return `- D ${daysUntil(date) * -1}`
  }

  const showError = (message: string) => {
    setIsLoading()
    showToast(message)
  }

  const showSuccess = (message: string) => {
    setIsLoading()
    showToast(message)
  }

  const changedEvent = async (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
    const event: EventModel = {
      title: title,
      content: content,
      targetAt: dateToTimestamp(date),
    }
    const uploadResult = await updateEvent(event, snapshot)
    if (!uploadResult) {
      showError('서버에러 입니다.')
      return
    }
    showSuccess('이벤트가 등록되었습니다')
    navigation.goBack()
  }

  const uploadImage = async (): Promise<string[]> => {
    if (!imageList) return []

    const uploadPromises = imageList.map(image =>
      uploadEventImage(
        title,
        `${image.filename}.${getFileExtension(image.path)}`,
        image.path,
      ),
    )

    try {
      const result: string[] = []
      const uploadResult = await Promise.all(uploadPromises)
      uploadResult.forEach(element => {
        if (!!element) {
          result.push(element)
        }
      })
      return result
    } catch (error) {
      console.error('One or more image uploads failed:', error)
      return []
    }
  }

  const uploadEvent = async () => {
    setIsLoading()
    const checkDuplicated = await checkDuplicate(title)
    if (checkDuplicated && !isEdit) {
      showError('중복되는 제목입니다.')
      return
    } else if (isEdit && checkDuplicated) {
      changedEvent(checkDuplicated)
      return
    }
    const imageResult = await uploadImage()
    const event: EventModel = {
      title: title,
      content: content,
      targetAt: dateToTimestamp(date),
      imageUrl: imageResult,
    }
    const uploadResult = await addEvent(event)
    if (!uploadResult) {
      showError('서버에러 입니다.')
      return
    }
    showSuccess('이벤트가 등록되었습니다')
    navigation.goBack()
  }

  const checkPermission = usePermissionStore(state => state.checkPermission)
  const openPermissionModal = usePermissionStore(
    state => state.openPermissionModal,
  )
  const openPicker = async () => {
    const {width, height} = Dimensions.get('window')
    const aspectRatio = width / height

    const cropWidth = 1000
    const cropHeight = cropWidth / aspectRatio

    const isHaveNoPermission = await checkPermission()
    if (isHaveNoPermission?.length > 0) {
      openPermissionModal(navigation)
    } else {
      ImageCropPicker.openPicker({
        cropping: true,
        multiple: true,
        width: cropWidth,
        height: cropHeight,
        maxFiles: 20,
      })
        .then(image => {
          setImageList(image)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  const deletedImage = (item: ImageOrVideo) => {
    if (!imageList) return
    const index = imageList.findIndex(element => element === item)
    if (index !== -1 && !!imageList) {
      const newList = [...imageList]
      newList.splice(index, 1)
      setImageList(newList)
    }
  }

  const renderItem: ListRenderItem<ImageOrVideo> = ({item, index}) => {
    return (
      <EventImageListItem
        item={item}
        index={index}
        onPressItem={deletedImage}
      />
    )
  }

  return (
    <SafeAreaView style={defaultStyles.containerStyle}>
      <CustomHeader title="EditEventScreen" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={defaultStyles.scrollContentContainerStyle}
        style={[defaultStyles.contentContainerStyle]}>
        <View style={styles.dayCountView}>
          <Text>{`${dateFormat()}`}</Text>
        </View>
        <TextInputWithTitle
          title={'제목'}
          placeholder={'최대 20자'}
          maxLength={20}
          onChangeText={onChangeTitle}
          value={title}
          activeBorderColor={colors.c242424}
          inActiveBorderColor={colors.cf4f4f4}
        />
        <TextInputWithTitle
          title={'내용'}
          placeholder={'최대 300자'}
          maxLength={300}
          multiline
          onChangeText={onChangeContent}
          value={content}
          activeBorderColor={colors.c242424}
          inActiveBorderColor={colors.cf4f4f4}
        />
        <TextInputTitle title={'날짜'} containerStyle={styles.titleContainer} />
        <DatePicker
          mode={'date'}
          date={date}
          onDateChange={setDate}
          style={styles.datePickerStyle}
        />

        <View style={styles.imageButtonView}>
          <TextInputTitle
            title={'사진'}
            containerStyle={styles.titleContainer}
          />
          <TouchableOpacity onPress={openPicker} style={styles.imageButton}>
            <Icon name="plus" size={normalize(20)} color={colors.c242424} />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={imageList}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparatorComponent}
          contentContainerStyle={styles.imageContentContainerStyle}
        />
      </ScrollView>
      <CustomBottomButton
        isDisabled={!title || !content}
        buttonText="완료"
        onPressButton={uploadEvent}
      />
    </SafeAreaView>
  )
}

const ItemSeparatorComponent = () => <View style={{width: normalize(10)}} />

const styles = StyleSheet.create({
  dayCountView: {alignItems: 'center', marginBottom: normalize(12)},
  titleContainer: {
    paddingHorizontal: normalize(24),
    marginBottom: normalize(6),
  },
  titleStyle: {
    color: colors.c242424,
  },
  datePickerStyle: {
    width: Dimensions.get('window').width,
  },
  imageButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(20),
  },
  imageButton: {
    paddingRight: normalize(20),
    alignItems: 'flex-end',
    paddingLeft: normalize(30),
  },
  imageContentContainerStyle: {
    paddingHorizontal: normalize(20),
  },
})

export default EditEventScreen
