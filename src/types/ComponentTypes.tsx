import {Ref} from 'react'
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native'

import {ToastConfig} from 'react-native-toast-message'

export interface CustomHeaderProps {
  title: string
  titleStyle?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
  buttonText?: string
  iconColor?: string
  onPressButton?: () => {}
}

export interface CustomBottomButtonProps {
  buttonText: string
  textStyle?: StyleProp<TextStyle>
  style?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
  onPressButton?: () => void
  isDisabled?: boolean
  inActiveTextStyle?: StyleProp<TextStyle>
  inActiveViewStyle?: StyleProp<ViewStyle>
}

export interface CustomTextInputProps extends TextInputProps {
  placeholder: string
  isError?: boolean
  containerStyle?: StyleProp<ViewStyle>
  isMaxLengthCount?: boolean
  ref?: Ref<TextInput>
  activeBorderColor?: string
  inActiveBorderColor?: string
  lengthTextStyle?: StyleProp<TextStyle>
  errorMessage?: string
}

export interface TextInputTitleProps {
  title: string
  style?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
}

export interface ToastTypes {
  type: 'success' | 'error' | 'tomatoToast'
}
