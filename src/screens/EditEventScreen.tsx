import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'
import {View, Text, Button, ScrollView, StyleSheet} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import defaultStyles from '../styles'
import {
  CustomBottomButton,
  CustomHeader,
  CustomTextInput,
  TextInputWithTitle,
} from '../components'
import colors from '../styles/colors'
import {normalize} from '../utils'

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

  const onChangeTitle = (value: string) => {
    setTitle(value)
  }

  const onChangeContent = (value: string) => {
    setContent(value)
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
          <Text>123</Text>
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
      </ScrollView>
      <CustomBottomButton buttonText="완료" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  dayCountView: {alignItems: 'center', marginBottom: normalize(12)},
})

export default EditEventScreen
