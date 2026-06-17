import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useRef, useState} from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
  ListRenderItem,
} from 'react-native'
import ImageCropPicker, {ImageOrVideo} from 'react-native-image-crop-picker'
import {
  useAppStateStore,
  useAuthStore,
  useLetterStore,
  usePermissionStore,
} from '../stores'
import {
  CustomBackgroundOpacity,
  CustomBottomButton,
  CustomHeader,
  TextInputWithTitle,
  TextInputTitle,
  EventImageListItem,
} from '../components'
import {SafeAreaView} from 'react-native-safe-area-context'
import defaultStyles from '../styles'
import {getFileExtension, normalize} from '../utils'
import FastImage, {Source} from '@d11/react-native-fast-image'
import colors from '../styles/colors'
import Icon from 'react-native-vector-icons/Feather'
import {FirebaseDatabaseTypes} from '@react-native-firebase/database'

type EditLetterScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'EditLetterScreen'
>
type EditLetterScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'EditLetterScreen'
>

type Props = {
  navigation: EditLetterScreenNavigationProp
  route: EditLetterScreenRouteProp
}

const EditLetterScreen: React.FC<Props> = ({navigation, route}) => {
  const checkPermission = usePermissionStore(state => state.checkPermission)
  const openPermissionModal = usePermissionStore(
    state => state.openPermissionModal,
  )

  const showToast = useAppStateStore(state => state.showToast)
  const setIsLoading = useAppStateStore(state => state.setIsLoading)

  const addLetter = useLetterStore(state => state.addLetter)
  const updateLetter = useLetterStore(state => state.updateLetter)
  const checkDuplicate = useLetterStore(state => state.checkDuplicated)
  const uploadLetterImage = useLetterStore(state => state.uploadLetterImage)
  const currentUser = useAuthStore(state => state.currentUser)

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [password, setPassword] = useState('')
  const [hint, setHint] = useState('')
  const isEdit = route.params?.isEdit
  const editLetterItem = route.params?.letter
  const [imageList, setImageList] = useState<ImageOrVideo[] | null>(null)
  const [tempImages, setTempImages] = useState<string[] | null>(null)

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
        maxFiles: 20,
        width: cropWidth,
        height: cropHeight,
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

  const onChangeTitle = (value: string) => {
    setTitle(value)
  }
  const onChangeText = (value: string) => {
    setText(value)
  }

  const onChangePassword = (value: string) => {
    setPassword(value)
  }

  const onChangeHint = (value: string) => {
    setHint(value)
  }

  const showError = (message: string) => {
    setIsLoading()
    showToast(message)
  }

  const showSuccess = (message: string) => {
    setIsLoading()
    showToast(message)
  }

  const uploadImage = async (): Promise<string[]> => {
    if (!imageList) return []

    const uploadPromises = imageList.map(image =>
      uploadLetterImage(
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

  // const uploadImage = async () => {
  //   setIsLoading()
  //   if (!imageFileName.current || !imageFileUri.current) return false
  //   const checkDuplicated = await checkDuplicate(title)
  //   if (checkDuplicated && !isEdit) {
  //     showError('중복되는 제목입니다.')
  //     return
  //   }
  //   const uploadLetterImageResult = await uploadLetterImage(
  //     imageFileName.current,
  //     imageFileUri.current,
  //   )
  //   if (!uploadLetterImageResult) {
  //     showError('잘못된 이미지입니다.')
  //     return
  //   }
  //   if (isEdit && checkDuplicated) {
  //     changedLetter(uploadLetterImageResult, checkDuplicated)
  //     return
  //   }
  //   uploadLetter(uploadLetterImageResult)
  // }

  // const changedLetter = async (
  //   uploadLetterImageResult: string,
  //   snapshot: FirebaseDatabaseTypes.DataSnapshot,
  // ) => {
  //   const imageResult = await uploadImage()
  //   const letter: LetterModel = {
  //     title: title,
  //     content: text,
  //     hint: hint,
  //     password: password,
  //     imageUrl: imageResult,
  //   }
  //   const uploadResult = await updateLetter(letter, snapshot)
  //   if (!uploadResult) {
  //     showError('서버에러 입니다.')
  //     return
  //   }
  //   showSuccess('이벤트가 등록되었습니다')
  //   navigation.goBack()
  // }

  const changedLetter = async (
    snapshot: FirebaseDatabaseTypes.DataSnapshot,
    imageResult?: string[],
  ) => {
    const event: LetterModel = {
      title: title,
      content: text,
      hint: hint,
      password: password,
      imageUrl: imageResult,
    }

    if (imageResult) {
      event.imageUrl = imageResult
    } else if (imageList?.length !== editLetterItem?.imageUrl?.length) {
      let tempImageList: string[] = []
      imageList?.forEach(element => {
        tempImageList.push(element?.path)
      })
      event.imageUrl = tempImageList
    }

    const uploadResult = await updateLetter(event, snapshot)
    if (!uploadResult) {
      showError('나한테 얘기해 서버 에러야 이거')
      return
    }
    showSuccess('편지 수정했어!')
    navigation.goBack()
  }

  const uploadLetter = async () => {
    setIsLoading()
    const isUnLockedUserId = currentUser?.email
      ? [currentUser?.email]
      : undefined

    const checkDuplicated = await checkDuplicate(title)
    if (checkDuplicated && !isEdit) {
      showError('이미 있는 제목이래')
      return
    } else if (isEdit && checkDuplicated) {
      if (editLetterItem?.imageUrl !== tempImages) {
        const imageResult = await uploadImage()
        changedLetter(checkDuplicated, imageResult)
        return
      }
      changedLetter(checkDuplicated)
      return
    }

    const imageResult = await uploadImage()
    const letter: LetterModel = {
      title: title,
      content: text,
      hint: hint,
      password: password,
      imageUrl: imageResult,
      isUnLockedUserId: isUnLockedUserId,
    }
    const uploadResult = await addLetter(letter)
    if (!uploadResult) {
      showError('나한테 얘기해 서버 에러야 이거')
      return
    }
    showSuccess('고마워 편지 써줘서 ㅎㅎ')
    navigation.goBack()
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
    <>
      <SafeAreaView
        style={[
          defaultStyles.containerStyle,
          {backgroundColor: colors.c242424},
        ]}>
        <CustomHeader
          title={isEdit ? '편지 수정하기' : '편지쓰기'}
          containerStyle={[defaultStyles.noBackgroundStyle]}
          titleStyle={styles.whiteText}
          iconColor={colors.cffffff}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={defaultStyles.scrollContentContainerStyle}
          style={[defaultStyles.contentContainerStyle]}>
          <TextInputWithTitle
            title={'제목'}
            placeholder={'최대 12자'}
            maxLength={12}
            isWhite
            onChangeText={onChangeTitle}
            value={title}
          />
          <TextInputWithTitle
            title={'내용'}
            placeholder={'최대 300자'}
            multiline
            maxLength={300}
            isWhite
            onChangeText={onChangeText}
            value={text}
          />
          <TextInputWithTitle
            title={'비밀번호'}
            placeholder={'최대 10자'}
            maxLength={10}
            isWhite
            onChangeText={onChangePassword}
            value={password}
          />
          <TextInputWithTitle
            title={'힌트'}
            placeholder={'최대 30자'}
            maxLength={30}
            isWhite
            onChangeText={onChangeHint}
            value={hint}
          />
          <View style={styles.imageButtonView}>
            <TextInputTitle
              title={'사진'}
              containerStyle={styles.titleContainer}
              style={styles.whiteText}
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
          onPressButton={uploadLetter}
          isDisabled={!title || !text || !hint || !password || !imageList}
          buttonText={'저장'}
          textStyle={styles.whiteText}
          style={defaultStyles.noBackgroundStyle}
          inActiveTextStyle={styles.inAcitveButtonTextStyle}
        />
      </SafeAreaView>
    </>
  )
}
const ItemSeparatorComponent = () => <View style={{width: normalize(10)}} />

const styles = StyleSheet.create({
  textInputWithTitleContainer: {
    width: '100%',
    marginBottom: normalize(24),
  },
  titleContainer: {
    paddingHorizontal: normalize(24),
    marginBottom: normalize(6),
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
    flex: 1,
  },
  whiteText: {
    color: colors.cffffff,
  },
  inAcitveButtonTextStyle: {
    color: colors.cffffff80,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
  },
  noImage: {
    borderRadius: normalize(4),
    borderWidth: normalize(1),
    borderColor: colors.cf4f4f4,
    marginHorizontal: normalize(20),
    marginVertical: normalize(20),
  },
  imageContentContainerStyle: {
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(10),
  },
})

export default EditLetterScreen
