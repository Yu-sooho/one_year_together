import React from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import {RouteProp} from '@react-navigation/native'
import {normalize} from '../utils'
import colors from '../styles/colors'
import {StackNavigationProp} from '@react-navigation/stack'
import {DEFAULT_BOTTOM_SIZE} from '../styles/const'
import fonts from '../styles/fonts'

type CustomModalScreenNavigationProp = StackNavigationProp<
  MainStackNavigatorParamList,
  'CustomModalScreen'
>
type CustomModalScreenRouteProp = RouteProp<
  MainStackNavigatorParamList,
  'CustomModalScreen'
>

type Props = {
  navigation: CustomModalScreenNavigationProp
  route: CustomModalScreenRouteProp
}
const CustomModalScreen: React.FC<Props> = ({navigation, route}) => {
  const navigatedBack = () => {
    navigation.goBack()
  }

  const {
    isShowOk = true,
    isShowCancel = true,
    title = '제목',
    contents = '내용',
    okText = '확인',
    okAction,
    cancelText = '취소',
  } = route.params

  const onPressOk = () => {
    if (okAction) {
      okAction()
    }
    navigatedBack()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={navigatedBack}
        style={styles.backgroundButton}
      />
      <View style={styles.content}>
        {!!title && (
          <View style={styles.header}>
            <Text style={fonts.bmjua16}>{title}</Text>
          </View>
        )}
        {!!contents && (
          <View style={styles.detail}>
            <Text style={fonts.bmjua14}>{contents}</Text>
          </View>
        )}
        <View style={styles.bottomButtons}>
          {isShowCancel && (
            <TouchableOpacity onPress={navigatedBack} style={styles.button}>
              <Text style={fonts.bmjua14}>{cancelText}</Text>
            </TouchableOpacity>
          )}
          <View
            style={{
              paddingBottom: normalize(14),
            }}>
            <View
              style={{
                height: normalize(20),
                width: normalize(1),
                backgroundColor: colors.cd4d4d4,
              }}
            />
          </View>
          {isShowOk && (
            <TouchableOpacity onPress={onPressOk} style={styles.button}>
              <Text style={fonts.bmjua14}>{okText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  backgroundButton: {
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  content: {
    width: normalize(320),
    paddingTop: DEFAULT_BOTTOM_SIZE,
    backgroundColor: colors.cffffff,
    borderRadius: normalize(8),
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detail: {
    justifyContent: 'center',
    minHeight: normalize(75),
    alignItems: 'center',
  },
  bottomButtons: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: normalize(20),
  },
})

export default CustomModalScreen
