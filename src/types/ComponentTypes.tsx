import {StyleProp, TextStyle, ViewStyle} from 'react-native'

export interface CustomHeaderProps {
  title: string
  titleStyle?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
  buttonText?: string
  onPressButton?: () => {}
}