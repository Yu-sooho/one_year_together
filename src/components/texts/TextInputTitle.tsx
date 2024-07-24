import React, {memo} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {TextInputTitleProps} from '../../types/ComponentTypes'
import fonts from '../../styles/fonts'
import colors from '../../styles/colors'

const TextInputTitle: React.FC<TextInputTitleProps> = memo(
  ({title, containerStyle, isWhite, style}) => {
    return (
      <View style={[containerStyle]}>
        <Text
          style={[
            isWhite ? styles.defaultWhiteTextStyle : styles.defaultTextStyle,
            style,
          ]}>
          {title}
        </Text>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  defaultTextStyle: {
    ...fonts.bmjua16,
  },
  defaultWhiteTextStyle: {
    ...fonts.bmjua16,
    color: colors.cffffff,
  },
})

export default TextInputTitle
