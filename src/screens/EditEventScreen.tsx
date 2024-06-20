import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native'
import DatePicker from 'react-native-date-picker'
import {SafeAreaView} from 'react-native-safe-area-context'
import defaultStyles from '../styles'
import {
  CustomBottomButton,
  CustomHeader,
  TextInputTitle,
  TextInputWithTitle,
} from '../components'
import colors from '../styles/colors'
import {dateToTimestamp, daysUntil, normalize} from '../utils'
import {useAppStateStore, useEventStore} from '../stores'
import {FirebaseDatabaseTypes} from '@react-native-firebase/database'

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
    const event: EventModel = {
      title: title,
      content: content,
      targetAt: dateToTimestamp(date),
    }
    const uploadResult = await addEvent(event)
    if (!uploadResult) {
      showError('서버에러 입니다.')
      return
    }
    showSuccess('이벤트가 등록되었습니다')
    navigation.goBack()
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
      </ScrollView>
      <CustomBottomButton buttonText="완료" onPressButton={uploadEvent} />
    </SafeAreaView>
  )
}

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
})

export default EditEventScreen
