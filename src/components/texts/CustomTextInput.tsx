import React, {memo, useEffect, useRef, useState} from 'react'
import {StyleSheet, Text, TextInput, View} from 'react-native'
import fonts from '../../styles/fonts'
import {CustomTextInputProps} from '../../types/ComponentTypes'
import {normalize} from '../../utils'
import colors from '../../styles/colors'

const CustomTextInput: React.FC<CustomTextInputProps> = memo(
  ({
    containerStyle,
    isError,
    activeBorderColor,
    inActiveBorderColor,
    isMaxLengthCount,
    ref,
    lengthTextStyle,
    errorMessage,
    ...props
  }) => {
    const textInputRef = useRef<TextInput>(null)
    const [textValue, setTextValue] = useState<string>('')

    useEffect(() => {
      if (props.value !== undefined) {
        setTextValue(props.value)
      }
    }, [props.value])

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.view,
            props.value ? styles.activeBorder : styles.inActiveBorder,
            isError && styles.errorBorder,
            props.multiline && styles.multiLineBorder,
            containerStyle,
            !!inActiveBorderColor &&
              !!activeBorderColor && {
                borderColor: props.value
                  ? activeBorderColor
                  : inActiveBorderColor,
              },
          ]}>
          <TextInput
            {...props}
            ref={ref || textInputRef}
            style={[
              styles.defaultTextStyle,
              isError && styles.errorText,
              props?.style,
            ]}
          />
        </View>
        {isMaxLengthCount && props?.maxLength && (
          <View style={[styles.container, styles.lengthView]}>
            <Text
              style={[
                styles.lengthText,
                lengthTextStyle,
              ]}>{`${textValue.length} / ${props.maxLength}`}</Text>
          </View>
        )}
        {errorMessage != null && (
          <View style={[styles.container, styles.errorView]}>
            <Text
              style={[
                styles.lengthText,
                styles.errorText,
              ]}>{`${errorMessage}`}</Text>
          </View>
        )}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  view: {
    paddingVertical: normalize(8),
    borderBottomWidth: normalize(1),
    marginHorizontal: normalize(20),
  },
  multiLineBorder: {
    borderWidth: normalize(1),
    minHeight: normalize(80),
  },
  activeBorder: {
    borderColor: colors.c242424,
  },
  inActiveBorder: {
    borderColor: colors.cf4f4f4,
  },
  errorBorder: {
    borderColor: colors.cff5733,
  },
  lengthView: {
    alignItems: 'flex-end',
    paddingRight: normalize(20),
    paddingTop: normalize(4),
  },
  errorView: {
    alignItems: 'flex-start',
    paddingLeft: normalize(20),
    paddingTop: normalize(4),
  },
  defaultTextStyle: {
    ...fonts.bmjua18,
    paddingHorizontal: normalize(8),
    paddingVertical: 0,
  },
  errorText: {
    color: colors.cff5733,
  },
  lengthText: {
    ...fonts.bmjua14,
  },
})

export default CustomTextInput
