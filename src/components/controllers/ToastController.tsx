import React, {memo} from 'react'
import Toast, {BaseToast, ToastConfig} from 'react-native-toast-message'
import {normalize} from '../../utils'
import {StyleSheet, Text, Image, View} from 'react-native'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'
import {images} from '../../resources'
import Balloon from 'react-native-balloon'

const ToastController = memo(() => {
  const toastConfig: ToastConfig = {
    success: props => (
      <BaseToast
        {...props}
        style={styles.toastStyle}
        contentContainerStyle={styles.toastStyle}
        text1Style={{
          fontSize: 15,
          fontWeight: '400',
        }}
      />
    ),
    error: props => (
      <View style={{paddingBottom: normalize(120), alignItems: 'center'}}>
        <Balloon
          borderColor={colors.c242424}
          backgroundColor={colors.cffffff}
          borderWidth={1}
          borderRadius={10}
          triangleSize={10}
          width={normalize(200)}
          triangleOffset="25%"
          containerStyle={{
            padding: 10,
          }}>
          <Text
            style={{
              ...fonts.nanumgy24,
              fontSize: normalize(22),
              textAlign: 'center',
            }}>{`비밀번호가 이게 아니래 ㅜㅜ`}</Text>
        </Balloon>
        <Image
          style={{width: normalize(100), height: normalize(100)}}
          source={images.error_image}
        />
      </View>
    ),
    defaultToast: ({text1, props}) => (
      <View style={styles.toastStyle}>
        <Text style={styles.toastTextStyle}>{text1}</Text>
      </View>
    ),
  }

  return <Toast config={toastConfig} />
})

const styles = StyleSheet.create({
  toastStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(22),
    paddingVertical: normalize(12),
    backgroundColor: colors.c242424,
    borderRadius: normalize(8),
  },
  toastTextStyle: {
    ...fonts.bmjua16,
    color: colors.cffffff,
  },
})

export default ToastController
