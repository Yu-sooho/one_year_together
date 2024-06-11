import React from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import {RouteProp, useNavigation} from '@react-navigation/native'
import {normalize} from '../utils'
import colors from '../styles/colors'
import {StackNavigationProp} from '@react-navigation/stack'

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
            <Text>{title}</Text>
          </View>
        )}
        {!!contents && (
          <View style={styles.detail}>
            <Text>{contents}</Text>
          </View>
        )}
        <View style={styles.bottomButtons}>
          {isShowCancel && (
            <TouchableOpacity onPress={navigatedBack} style={styles.button}>
              <Text>{cancelText}</Text>
            </TouchableOpacity>
          )}
          {isShowOk && (
            <TouchableOpacity onPress={onPressOk} style={styles.button}>
              <Text>{okText}</Text>
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
    paddingVertical: normalize(12),
    backgroundColor: colors.cffffff,
    borderRadius: normalize(8),
  },
  header: {
    height: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  detail: {
    justifyContent: 'center',
    minHeight: normalize(100),
    alignItems: 'center',
  },
  bottomButtons: {
    height: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default CustomModalScreen
