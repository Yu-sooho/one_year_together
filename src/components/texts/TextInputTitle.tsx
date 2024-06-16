import React, {memo} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {TextInputTitleProps} from '../../types/ComponentTypes'
import fonts from '../../styles/fonts'

const TextInputTitle: React.FC<TextInputTitleProps> = memo(
  ({title, containerStyle, style}) => {
    return (
      <View style={[containerStyle]}>
        <Text style={[styles.defaultTextStyle, style]}>{title}</Text>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  defaultTextStyle: {
    ...fonts.bmjua16,
  },
})

export default TextInputTitle
