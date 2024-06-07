import {
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack'

export const defaultScreenOptions: StackNavigationOptions = {
  headerShown: false,
  ...TransitionPresets.SlideFromRightIOS,
}
