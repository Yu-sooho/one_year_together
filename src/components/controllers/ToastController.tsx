import React, {memo} from 'react'
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from 'react-native-toast-message'
import {normalize} from '../../utils'
import {StyleSheet, Text, View} from 'react-native'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

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
      <ErrorToast
        {...props}
        style={styles.toastStyle}
        contentContainerStyle={styles.toastStyle}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
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
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
    backgroundColor: colors.cffffff,
    borderRadius: normalize(8),
  },
  toastTextStyle: {
    ...fonts.nanumgn24,
  },
})

export default ToastController
