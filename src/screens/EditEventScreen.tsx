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
  StatusBar,
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
import {
  dateToTimestamp,
  daysUntil,
  extractFileName,
  getFileExtension,
  normalize,
  timestampToDate,
} from '../utils'
import {useAppStateStore, useEventStore, usePermissionStore} from '../stores'
import Icon from 'react-native-vector-icons/Feather'
import {FirebaseDatabaseTypes} from '@react-native-firebase/database'
import ImageCropPicker, {ImageOrVideo} from 'react-native-image-crop-picker'
import fonts from '../styles/fonts'

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
  const [tempImages, setTempImages] = useState<string[] | null>(null)

  const showToast = useAppStateStore(state => state.showToast)
  const setIsLoading = useAppStateStore(state => state.setIsLoading)

  const addEvent = useEventStore(state => state.addEvent)
  const updateEvent = useEventStore(state => state.updateEvent)
  const checkDuplicate = useEventStore(state => state.checkDuplicated)
  const uploadEventImage = useEventStore(state => state.uploadEventImage)
  const isEdit = route.params?.isEdit
  const editEventItem = route.params?.event

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

  const changedEvent = async (
    snapshot: FirebaseDatabaseTypes.DataSnapshot,
    imageResult?: string[],
  ) => {
    const event: EventModel = {
      title: title,
      content: content,
      targetAt: dateToTimestamp(date),
    }

    if (imageResult) {
      event.imageUrl = imageResult
    } else if (imageList?.length !== editEventItem?.imageUrl?.length) {
      let tempImageList: string[] = []
      imageList?.forEach(element => {
        tempImageList.push(element?.path)
      })
      event.imageUrl = tempImageList
    }

    const uploadResult = await updateEvent(event, snapshot)
    if (!uploadResult) {
      showError('나한테 얘기해 서버 에러야 이거')
      return
    }
    showSuccess('기억해둘게!!ㅋㅋ')
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
      showError('같은 제목은 못만들어!')
      return
    } else if (isEdit && checkDuplicated) {
      if (editEventItem?.imageUrl !== tempImages) {
        const imageResult = await uploadImage()
        changedEvent(checkDuplicated, imageResult)
        return
      }
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
      showError('나한테 얘기해 서버 에러야 이거')
      return
    }
    showSuccess('기억해둘게!!ㅋㅋ')
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

  const editableSetting = () => {
    setTitle(`${editEventItem?.title}`)
    setContent(`${editEventItem?.content}`)
    if (editEventItem?.targetAt) {
      const targetAt = timestampToDate(editEventItem?.targetAt)
      setDate(targetAt)
    }
    if (editEventItem?.imageUrl) {
      const tempImage: ImageOrVideo[] = []
      editEventItem?.imageUrl.forEach(element => {
        tempImage.push({
          creationDate: `${Date.now()}`,
          cropRect: null,
          data: null,
          duration: null,
          exif: null,
          filename: extractFileName(element),
          height: 0,
          mime: 'image/jpeg',
          path: element,
          size: 0,
          sourceURL: element,
          width: 0,
        })
      })
      setTempImages(editEventItem?.imageUrl)
      setImageList(tempImage)
    }
  }

  useEffect(() => {
    if (isEdit && !!editEventItem) {
      editableSetting()
    }
  }, [])

  return (
    <SafeAreaView
      style={[defaultStyles.containerStyle, {backgroundColor: colors.c242424}]}>
      <StatusBar barStyle="dark-content" />
      <CustomHeader
        title={isEdit ? '특별한 날이었지?' : '특별한 날이야?'}
        titleStyle={{color: colors.cffffff}}
        iconColor={colors.cffffff}
        containerStyle={{backgroundColor: colors.c242424}}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={defaultStyles.scrollContentContainerStyle}
        style={[defaultStyles.contentContainerStyle]}>
        <View style={styles.dayCountView}>
          <Text style={styles.ddayText}>{`${dateFormat()}`}</Text>
        </View>
        <TextInputWithTitle
          title={'제목'}
          placeholder={'최대 20자'}
          maxLength={20}
          onChangeText={onChangeTitle}
          value={title}
          isWhite
          activeBorderColor={colors.cffffff}
          inActiveBorderColor={colors.cd4d4d4}
        />
        <TextInputWithTitle
          title={'내용'}
          placeholder={'최대 300자'}
          maxLength={300}
          multiline
          onChangeText={onChangeContent}
          value={content}
          isWhite
          activeBorderColor={colors.cffffff}
          inActiveBorderColor={colors.cd4d4d4}
        />
        <TextInputTitle
          title={'날짜'}
          isWhite
          containerStyle={styles.titleContainer}
        />
        <DatePicker
          mode={'date'}
          date={date}
          onDateChange={setDate}
          theme={'dark'}
          style={styles.datePickerStyle}
        />

        <View style={styles.imageButtonView}>
          <TextInputTitle
            title={'사진'}
            isWhite
            containerStyle={styles.titleContainer}
          />
          <TouchableOpacity onPress={openPicker} style={styles.imageButton}>
            <Icon name="plus" size={normalize(20)} color={colors.cffffff} />
          </TouchableOpacity>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
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
        textStyle={{color: colors.cffffff}}
        containerStyle={{backgroundColor: colors.c242424}}
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
  ddayText: {
    ...fonts.bmjua14,
    color: colors.cffffff,
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
