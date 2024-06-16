import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {memo, useCallback, useEffect, useRef, useState} from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TextInputProps,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import ImageCropPicker from 'react-native-image-crop-picker'
import {useAppStateStore, useLetterStore, usePermissionStore} from '../stores'
import {
  CustomBackgroundOpacity,
  CustomBottomButton,
  CustomHeader,
  CustomTextInput,
  TextInputTitle,
} from '../components'
import {SafeAreaView} from 'react-native-safe-area-context'
import defaultStyles from '../styles'
import {getFileExtension, normalize} from '../utils'
import FastImage, {Source} from 'react-native-fast-image'
import colors from '../styles/colors'
import Icon from 'react-native-vector-icons/Feather'

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
  const checkDuplicate = useLetterStore(state => state.checkDuplicated)
  const uploadLetterImage = useLetterStore(state => state.uploadLetterImage)

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const [selectedUri, setSelectedUri] = useState<number | Source | undefined>(
    undefined,
  )
  const imageFileName = useRef<string | null | undefined>(null)
  const imageFileUri = useRef<string | null | undefined>(null)

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
        multiple: false,
        width: cropWidth,
        height: cropHeight,
      })
        .then(image => {
          if (!!image?.path) {
            setSelectedUri({uri: image.path})
            imageFileName.current = `${image.filename}.${getFileExtension(
              image.path,
            )}`
            imageFileUri.current = image.path
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  const onChangeTitle = (value: string) => {
    setTitle(value)
  }
  const onChangeText = (value: string) => {
    setText(value)
  }

  const uploadImage = async () => {
    setIsLoading()
    if (!imageFileName.current || !imageFileUri.current) return false
    const checkDuplicated = await checkDuplicate(title)
    if (checkDuplicated) {
      showError('중복되는 제목입니다.')
      return
    }
    const uploadLetterImageResult = await uploadLetterImage(
      imageFileName.current,
      imageFileUri.current,
    )
    if (!uploadLetterImageResult) {
      showError('잘못된 이미지입니다.')
      return
    }
    uploadLetter(uploadLetterImageResult)
  }

  const showError = (message: string) => {
    // setIsLoading()
    showToast(message)
  }

  const showSuccess = (message: string) => {
    // setIsLoading()
    showToast(message)
  }

  const uploadLetter = async (uploadLetterImageResult: string) => {
    const letter: LetterModel = {
      title: title,
      content: text,
      imageUrl: uploadLetterImageResult,
    }
    const uploadResult = await addLetter(letter)
    if (!uploadResult) {
      showError('서버에러 입니다.')
      return
    }
    showSuccess('이벤트가 등록되었습니다')
    navigation.goBack()
  }

  return (
    <>
      <FastImage style={styles.image} source={selectedUri} />
      <CustomBackgroundOpacity isNoOpacity={selectedUri ? false : true} />
      <SafeAreaView
        style={[defaultStyles.containerStyle, defaultStyles.noBackgroundStyle]}>
        <CustomHeader
          title="EditLetterScreen"
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
            placeholder={'최대 20자'}
            maxLength={20}
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
        </ScrollView>
        <CustomBottomButton
          onPressButton={uploadImage}
          isDisabled={!selectedUri || !title || !text}
          buttonText={'저장'}
          textStyle={styles.whiteText}
          style={defaultStyles.noBackgroundStyle}
          inActiveTextStyle={styles.inAcitveButtonTextStyle}
        />
      </SafeAreaView>
    </>
  )
}

interface TextInputWithTitleProps extends TextInputProps {
  title: string
  placeholder: string
  isWhite?: boolean
}

const TextInputWithTitle = memo(
  ({
    title,
    placeholder,
    isWhite,
    multiline,
    ...props
  }: TextInputWithTitleProps) => {
    return (
      <View style={styles.textInputWithTitleContainer}>
        <TextInputTitle
          title={title}
          containerStyle={styles.titleContainer}
          style={[isWhite && styles.whiteText]}
        />
        <CustomTextInput
          {...props}
          multiline={multiline}
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={placeholder}
          isMaxLengthCount
          style={[isWhite && styles.whiteText]}
          inActiveBorderColor={colors.cffffff80}
          activeBorderColor={colors.cffffff}
          placeholderTextColor={isWhite ? colors.cffffff80 : undefined}
          lengthTextStyle={styles.whiteText}
        />
      </View>
    )
  },
)

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
})

export default EditLetterScreen
