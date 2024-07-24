import {Ref} from 'react'
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native'
import {SharedValue} from 'react-native-reanimated'

export interface CustomHeaderProps {
  title: string
  titleStyle?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
  buttonText?: string
  iconColor?: string
  rightContent?: React.ReactNode
  onPressButton?: () => void
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
  isWhite?: boolean
}

export interface MainScreenHeaderProps {
  scrollY: SharedValue<number>
  onPressItem: (item: EventModel) => void
}

export interface ToastTypes {
  type: 'success' | 'error' | 'tomatoToast'
}

export interface CustomRadioButtonProps {
  onPress: () => void
  value: boolean
  text: string
}

export interface EventListitemProps {
  item: EventModel
  index: number
  onPressItem: (item: EventModel) => void
  onLongPressItem: (item: EventModel) => void
  onPressDelete: (item: EventModel) => void
  onPressEdit: (item: EventModel) => void
}
