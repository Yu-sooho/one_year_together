import React, {memo} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {normalize} from '../../utils'
import {CustomBottomButtonProps} from '../../types/ComponentTypes'
import colors from '../../styles/colors'
import {DEFAULT_BOTTOM_SIZE} from '../../styles/const'

const CustomBottomButton: React.FC<CustomBottomButtonProps> = memo(
  ({buttonText, onPressButton, style, containerStyle, textStyle}) => {
    return (
      <View style={[styles.containerStyle, containerStyle]}>
        <TouchableOpacity
          onPress={onPressButton}
          style={[styles.buttonStyle, style]}>
          <Text style={[styles.textStyle, textStyle]}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: DEFAULT_BOTTOM_SIZE,
    paddingHorizontal: normalize(20),
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(50),
    backgroundColor: colors.c24242480,
    borderRadius: normalize(4),
  },
  textStyle: {},
})

export default CustomBottomButton
