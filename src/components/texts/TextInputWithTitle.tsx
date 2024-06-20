import {StyleSheet, TextInputProps, View} from 'react-native'
import React, {memo} from 'react'
import TextInputTitle from './TextInputTitle'
import CustomTextInput from './CustomTextInput'
import colors from '../../styles/colors'
import {normalize} from '../../utils'

interface TextInputWithTitleProps extends TextInputProps {
  title: string
  placeholder: string
  isWhite?: boolean
  activeBorderColor?: string
  inActiveBorderColor?: string
}

const TextInputWithTitle = memo(
  ({
    title,
    placeholder,
    isWhite,
    multiline,
    activeBorderColor,
    inActiveBorderColor,
    ...props
  }: TextInputWithTitleProps) => {
    return (
      <View style={styles.textInputWithTitleContainer}>
        <TextInputTitle
          title={title}
          containerStyle={styles.titleContainer}
          style={[isWhite && styles.whiteText]}
        />
        <CustomTextInput
          {...props}
          multiline={multiline}
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={placeholder}
          isMaxLengthCount
          style={[isWhite && styles.whiteText]}
          inActiveBorderColor={inActiveBorderColor || colors.cffffff80}
          activeBorderColor={activeBorderColor || colors.cffffff}
          placeholderTextColor={isWhite ? colors.cffffff80 : undefined}
          lengthTextStyle={styles.whiteText}
        />
      </View>
    )
  },
)

const styles = StyleSheet.create({
  textInputWithTitleContainer: {
    width: '100%',
    marginBottom: normalize(24),
  },
  titleContainer: {
    paddingHorizontal: normalize(24),
    marginBottom: normalize(6),
  },
  whiteText: {
    color: colors.cffffff,
  },
  inAcitveButtonTextStyle: {
    color: colors.cffffff80,
  },
})

export default TextInputWithTitle
